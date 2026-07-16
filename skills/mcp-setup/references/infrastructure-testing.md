# VM Image Testing Infrastructure: Tools & Techniques Reference

## Overview

The testing infrastructure for this project treats VM image validation as a multi-layered contract: static structural guarantees are separated from runtime behavioral guarantees, and both are separated from security posture checks. `hadolint` enforces Dockerfile quality at author time; `goss` and `dgoss` validate system state at both image-build time and post-boot runtime; `trivy` scans for CVEs before any packer build; and `pre-commit` gates all of the above at commit time. The Docker-plus-systemd test harness runs `startup.sh` with systemd as PID 1 in a container that mirrors the packer-baked GCE image, with a Python mock standing in for GCE metadata and Secret Manager APIs. Phase-based testing via `STARTUP_STOP_AFTER` lets engineers iterate on early boot stages without running the full lifecycle, keeping feedback loops short while the full `just test-real` path exercises the complete boot sequence with real secrets.

---

## hadolint

### What it does and why

`hadolint` parses Dockerfiles as an abstract syntax tree and validates against a set of Haskell-native best-practice rules. Critically, it also embeds `shellcheck`, meaning every `RUN` instruction is analyzed as a shell script. This makes it the intersection of Dockerfile linting and shell script analysis — a single tool catching both layer-efficiency anti-patterns and shell correctness issues before they enter the image.

### How it's used in this project

`hadolint` runs via a pre-commit hook declared in `.pre-commit-config.yaml`, triggered on any staged file matching the `dockerfile` type — which `pre-commit` detects by name pattern (`Dockerfile`, `Dockerfile.*`, `*.Dockerfile`). This covers both `vm/test/Dockerfile` (the test harness) and `vm/test/Dockerfile.base` (the packer mirror). The hook runs `hadolint` against each matched file and blocks the commit on any violation.

There is no separate `hadolint` invocation in the `Justfile`; the pre-commit hook is the enforcement point.

### Key techniques and best practices

**Rule categories.** DL-prefixed rules target Dockerfile structure; SC-prefixed rules come from the embedded shellcheck integration. Common DL rules that surface in practice:

- `DL3007` — avoid `latest` tag in `FROM`. Pinning an exact digest or version tag makes builds reproducible.
- `DL3008` — pin `apt-get` package versions. `apt-get install -y curl` is flagged; the pinned form is not. In a packer context, version drift in base tooling is a real risk.
- `DL3009` — delete the apt-get cache after install (`rm -rf /var/lib/apt/lists/*`).
- `DL3059` — multiple consecutive `RUN` instructions should be merged. Each `RUN` creates a layer; chaining with `&&` reduces image size and avoids cache-invalidation bugs (stale `apt-get update` layer).
- `DL3025` — use JSON array form for `CMD`/`ENTRYPOINT`. Shell form wraps in `/bin/sh -c`, preventing clean signal propagation to your process.
- `DL4006` — set `pipefail` when using pipes in `RUN`. Without it, a failing left side of a pipe is silently ignored.

**The pipefail idiom.** Add `SHELL ["/bin/bash", "-o", "pipefail", "-c"]` before any `RUN` that uses pipes. This satisfies both `DL4006` and `SC2086`-class warnings and is idiomatic in production Dockerfiles. Both Dockerfiles in this project use this pattern.

**Inline suppression.** When a violation is intentional, suppress inline with a comment on the line immediately before the instruction:

```dockerfile
# hadolint ignore=DL3008
RUN apt-get install -y some-tool
```

Add a note explaining the reason alongside the ignore. Multiple rules can be comma-separated.

**Project-wide config.** A `.hadolint.yaml` file at the repo root can suppress rules globally and declare trusted registries. Prefer inline suppression for one-off exceptions; use `.hadolint.yaml` only for rules consistently inapplicable to the project.

### Limitations and gotchas

`hadolint` validates syntax and best practice. It cannot reason about runtime behavior: a `RUN` that installs a binary in the wrong path, a `COPY` that places a file at the wrong location, or a misconfigured service unit will not be caught. The shellcheck integration analyzes each `RUN` in isolation — complex shell logic that spans multiple instructions is not tracked across layers. Secret leakage (hard-coded API keys in `ENV` or `RUN`) is also outside hadolint's scope — use the `scan-secrets` pre-commit hook for that.

---

## goss / dgoss

### What it does and why

`goss` is a YAML-based infrastructure testing tool that validates expected system state — binaries exist, services are active, ports are listening, files have the right content, commands produce the right output. It operates as a declarative spec: you define what the system should look like, and `goss validate` runs all checks in parallel and reports pass/fail. `dgoss` is a shell wrapper that injects the `goss` binary into a running container without modifying the image, enabling container validation without baking in test tooling.

This project uses goss at two tiers: static image validation (is everything baked correctly?) and runtime validation (did the boot sequence produce the right state?). Keeping these tiers separate is essential — image checks run fast without systemd, while runtime checks require the full systemd boot.

### How it's used in this project

**Four spec files, four phases:**

| Spec file | What it validates | How it runs |
|---|---|---|
| `goss-image.yaml` | Binaries (`which claude`, `which ccr`, `which bd`, etc.), service unit files on disk | `just validate-image` via dgoss, no boot |
| `goss-env.yaml` | Env file written, SSH key present, git config set | `just test-env` (STARTUP_STOP_AFTER=env) |
| `goss-ccr.yaml` | CCR config JSON valid, port 3456 reachable | `just test-ccr` (STARTUP_STOP_AFTER=ccr) |
| `goss-runtime.yaml` | All services active, full runtime wired | `just test-full` / `just test-real` |

**Static image validation** runs via `just validate-image`, which calls `dgoss run` against the base image. `dgoss` sets `GOSS_PATH`, `GOSS_FILE`, and `GOSS_FILES_PATH` and uses `GOSS_FILES_STRATEGY=cp` to copy the goss binary and spec file into the container at runtime. No image modification required. The pre-commit hook `goss-image-validate` calls `just validate-image` whenever `vm/test/goss-image.yaml`, `vm/image/setup.sh`, `vm/image/Brewfile`, `vm/test/Dockerfile.base`, or any file in `vm/image/services/` is staged.

**Runtime validation** runs inside the test container via `vm/test/entrypoint.sh`. After `startup.sh` completes (or stops at a phase boundary), `entrypoint.sh` invokes `goss validate` with the appropriate spec file. Exit code from goss propagates as the container exit code.

### Key techniques and best practices

**Authoring loop with `dgoss edit`.** The idiomatic way to write new goss specs is the `dgoss edit <image>` loop: it starts the container and drops you into a shell where you can run `goss add command "which node"`, `goss add file /etc/ccr.json`, etc. `goss add` introspects the live system and writes the assertion automatically. On exit, the spec is written back to the host. This is far faster than hand-writing YAML and guarantees the assertions match actual system state.

**Resource types in practice.** For this project the relevant types are:

- `command` — run a command, assert exit code and/or stdout matches. Used for `which <binary>` checks and `git config` assertions in `goss-env.yaml`.
- `file` — assert a file exists, has specific mode, owner, and contains a pattern. Used for service unit files, env files, and SSH key permissions.
- `addr` — assert a TCP address is reachable. Used for `tcp://localhost:3456` (CCR port). Supports `timeout` for slow-starting services.
- `service` — assert a systemd service is active. Used in `goss-runtime.yaml`.
- `user` / `group` — validate OS user and group existence and attributes.

**Parallel execution and its implications.** All goss assertions run concurrently. You cannot sequence checks — there is no "wait for service X, then check port Y" within a single `goss validate` invocation. The phase-based approach (separate spec files, separate `validate` runs at different startup stages) is the correct way to handle ordering dependencies.

**JSON validation without JSON parsing.** goss has no native JSON key extraction. To validate a JSON file's content (e.g., that `config.json` contains the right `PORT` value), the idiom is a `command` resource: `jq -e '.PORT' /path/to/config.json` with exit code 0. `entrypoint.sh` uses this pattern to validate CCR config structure — the `jq` check runs after goss, not inside it.

**Timeout on addr resources.** When a service takes a few seconds to start listening, set `timeout: 10000` (milliseconds) on the `addr` resource rather than adding `sleep` in `entrypoint.sh`. goss will poll until the timeout.

**Retry mode.** `goss validate --retry-timeout 30s --sleep 1s` keeps re-evaluating the spec until all checks pass or the timeout elapses. This is the canonical way to handle boot/startup races in the full systemd container.

**Spec composition with `gossfile`.** Large specs can be split across files using the `gossfile` resource and composed with `goss render`. This enables layered specs — a base spec plus environment-specific overlays — without duplicating checks.

### Limitations and gotchas

- **No JSON/YAML key parsing.** The `file` resource's `contains` does substring/regex matching on raw file content only. Always use a `command` resource with `jq` for JSON structure validation.
- **No ordering.** Resources run concurrently. Phase-based spec files are the workaround.
- **No provisioning.** Goss is purely a validator — it reads state but never writes it.
- **Service checks unreliable without systemd.** In plain Docker containers (no init), `service` resource checks fail or give misleading results. Use `addr`/`command`/`process` instead for non-systemd containers.
- **Stale base image.** If `vm/image/setup.sh` or a service unit changes and `just build-base` has not been run, `just validate-image` will pass against the old cached image and miss the regression. Always run `just build-base` after image-layer changes before relying on hook output.
- **dgoss requires a running container.** If the container crashes on startup (due to a bug), dgoss can't exec into it. Use `docker logs` to diagnose.

---

## trivy

### What it does and why

`trivy` is a comprehensive vulnerability scanner covering container images, filesystems, git repos, Terraform configs, and Kubernetes manifests. For this project its primary role is scanning the packer base image for CVEs before a new GCE image is cut. Catching a `HIGH` or `CRITICAL` CVE at scan time costs nothing; catching it after it is baked into a running VM costs a full packer rebuild and redeployment.

### How it's used in this project

`just scan` runs trivy against the base image via the Docker socket — no local trivy installation required:

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image \
  --severity HIGH,CRITICAL \
  --exit-code 1 \
  vm-hostess-base
```

The `--exit-code 1` flag makes trivy return non-zero when any `HIGH` or `CRITICAL` finding exists, enabling scripted gating. `just scan` is not hooked into pre-commit — it is a manual gate run after `just build-base` and before running `packer build`.

### Key techniques and best practices

**Scope of scanning.** A single `trivy image` invocation scans both the OS layer (Debian 13 / trixie package advisories from the Debian Security Tracker) and any language ecosystem packages installed in the image (npm, pip, cargo, Go modules). OS packages installed via apt are matched against Debian vendor advisories, not just NVD — this matters because Debian backports patches, and their CVE status differs from upstream. Language packages are matched against GitHub Advisory DB and ecosystem-specific advisories.

**Severity filtering.** `--severity HIGH,CRITICAL` is the standard CI gate threshold. `MEDIUM` and below produce too much noise for a blocking gate on a tooling VM. `--ignore-unfixed` is a useful companion flag — it skips CVEs with no available fix, reducing noise from unfixable OS package vulnerabilities that are endemic to any Debian image.

**Output formats.**
- Default table output for interactive use.
- `--format json` for programmatic consumption or piping to other tools.
- `--format sarif` for upload to the GitHub Security tab (`github/codeql-action/upload-sarif`).
- `--format cyclonedx` to produce a Software Bill of Materials.

`trivy convert` can transform between formats after scanning, so you can scan once to JSON and derive SARIF without re-scanning.

**`.trivyignore.yaml`.** The YAML format (preferred over the plain `.trivyignore` text format) supports structured entries with expiry dates:

```yaml
vulnerabilities:
  - id: CVE-2023-12345
    statement: "Not exploitable — this feature is not used in this image"
    expired_at: "2025-12-31"
```

Never add CVEs to `.trivyignore.yaml` without a written rationale — the file should be a deliberate suppression log, not a silencer.

**Running without local install.** The Docker socket mount (`-v /var/run/docker.sock:/var/run/docker.sock`) gives the trivy container access to locally built images. This is how `just scan` avoids requiring a local trivy binary while still scanning images that have not been pushed to a registry.

**DB freshness.** Trivy's vulnerability database is updated every 6 hours; the `aquasec/trivy` image should be pulled fresh before high-stakes scans. The DB is auto-downloaded on first run and cached locally; it is considered stale after 24 hours.

### Limitations and gotchas

- **Trivy requires the image to be built first.** `just scan` must run after `just build-base` — scanning a stale image gives stale results.
- **Deleted-layer artifacts.** Trivy scans all image layers including files deleted in later layers. A package installed and then `rm`-ed in a separate `RUN` layer will still be reported. Mitigation: install and clean in the same `RUN` instruction.
- **No runtime behavior scanning.** Trivy validates static image content, not what happens when the image runs. A misconfigured `startup.sh` that exposes a secret is invisible to trivy.
- **Language ecosystem accuracy.** Packages installed by unconventional means (direct binary download, `curl | sh`) are not scanned — only packages traceable through manifest files (`package-lock.json`, `go.sum`, etc.).
- **Third-party repos.** Packages from unofficial OS repos (EPEL, NVIDIA, etc.) are skipped for OS-level vuln detection — Debian vendor advisories don't cover them.
- **`--severity` filter and `--exit-code` in SARIF mode.** Known edge case: when using `--format sarif`, some trivy versions include all severities in the SARIF file regardless of `--severity`, which can cause exit code behavior to diverge from the filter. Test in your specific version.

---

## pre-commit

### What it does and why

`pre-commit` is a git hook framework: it installs managed hooks to `.git/hooks/pre-commit`, runs hooks selectively based on staged file patterns, and blocks commits on failures. In this project it serves as the automated quality gate — every commit triggers the relevant subset of checks without the author needing to remember to run them manually.

### How it's used in this project

The `.pre-commit-config.yaml` defines five hooks, all using `repo: local` with `language: system` (no virtualenv management; tools are expected to be installed on the host):

| Hook ID | Trigger | Action |
|---|---|---|
| `hadolint` | `types: [dockerfile]` | `hadolint` on each matched Dockerfile |
| `scan-secrets` | `always_run: true` | Secret scan using `git ls-files` scope |
| `gen-tools-context` | `vm/image/setup.sh` or `Brewfile` | Regenerates tools context document |
| `goss-image-validate` | Image-layer files | `just validate-image` |
| `startup-integration-test` | `vm/boot/startup.sh` or `vm/test/Dockerfile` | `just test-ccr` |

`pre-commit install` must be run once per checkout to wire the hooks. CI can run `pre-commit run --all-files` to execute all hooks against the full tree regardless of staged state.

### Key techniques and best practices

**`pass_filenames: false` for hooks that do their own discovery.** Hooks like `goss-image-validate` run a `just` target that internally determines what to scan. Set `pass_filenames: false` on any hook whose command is a `just` target or a script that does not accept file arguments.

**`always_run: true` for unconditional hooks.** The `scan-secrets` hook uses `always_run: true` because secret exposure is not limited to specific file types — a credential can appear in any file. Without `always_run`, a commit that only touches `.yaml` files would skip the secret scan if `files:` pattern does not match.

**`git ls-files` scope for secret scanning.** The secret scanner uses `git ls-files` to enumerate tracked files rather than scanning the working tree. Files in `.gitignore` (e.g., `terraform.tfvars` containing real secrets) are never scanned — and should not be, since they are intentionally excluded from the repository.

**Staged-only execution by default.** pre-commit passes only staged files to hooks. For local iteration this is correct behavior; for CI correctness, always use `--all-files`.

**Hook ordering.** Hooks run serially in declaration order; failure of any hook aborts the sequence. Order matters for efficiency: put fast hooks first (hadolint) and slow hooks last (startup integration test). This minimizes time wasted when an early hook fails.

**`files:` vs `types:`.** `types: [dockerfile]` handles file type detection by name pattern. `files:` uses Python regex matched against repo-relative file paths — it is the right tool for path-based triggers like `^vm/image/services/`. Both can be combined on the same hook (AND logic).

**CI integration.** `pre-commit run --all-files` runs all hooks against the full repo. `pre-commit run --from-ref origin/main --to-ref HEAD` runs hooks against files changed between two refs — efficient for PR pipelines. `SKIP=hook-id pre-commit run --all-files` skips specific slow hooks in CI.

### Limitations and gotchas

- **`language: system` means no isolation.** Hook tools must already be installed on the host. If `hadolint` is not on `PATH`, the hook fails with a confusing error rather than installing the tool. Document required host tools explicitly.
- **The goss hook does not rebuild the base image.** `goss-image-validate` runs `just validate-image` against whatever image is currently tagged. After `setup.sh` changes, manual `just build-base` is required before the hook reflects the new state.
- **Hooks do not run in parallel.** pre-commit runs hooks serially in declaration order. There is no `--jobs` flag for hook-level parallelism.

---

## systemd-in-Docker, Docker Compose Secrets, and the Mock Server

### What it does and why

The test harness replicates the GCE VM boot environment as faithfully as possible inside a Docker container. `startup.sh` makes calls to the GCE metadata API and Secret Manager; in production these are real GCP endpoints. In the test environment, a Python mock server (`vm/test/mock-server.py`) intercepts those calls. systemd runs as PID 1 inside the container, because `startup.sh` uses `systemctl` to enable and start services — and systemd's presence is required for those calls to succeed.

### How it's used in this project

**Two-image layering.** `vm/test/Dockerfile.base` mirrors `vm/image/setup.sh` exactly: it installs the same packages, creates the same users, writes the same service unit files. Building this image takes ~10 minutes but is heavily Docker-layer-cached. `vm/test/Dockerfile` is the test harness on top: it adds the mock server, entrypoint, goss binary, and test fixtures. Changing `entrypoint.sh` or `mock-server.py` only rebuilds the fast layer. The split is the critical architectural choice — without it, every change to `entrypoint.sh` would trigger a 10-minute rebuild.

**Running systemd as PID 1.** The Docker Compose config for the test container requires:

```yaml
privileged: true
tmpfs:
  - /run
  - /run/lock
```

And `STOPSIGNAL SIGRTMIN+3` in the `Dockerfile`. Each element is mandatory:

| Requirement | Reason |
|---|---|
| `privileged: true` | systemd needs `CAP_SYS_ADMIN` to mount cgroups and set up namespaces. Without it, PID 1 crashes immediately. |
| `--tmpfs /run`, `--tmpfs /run/lock` | systemd writes runtime state here. Tmpfs overlays let it write in-memory without touching the read-only image layer. |
| `STOPSIGNAL SIGRTMIN+3` | Docker's default stop signal is `SIGTERM`, which systemd ignores (reserved for re-exec). `SIGRTMIN+3` triggers clean shutdown. Without it, `docker stop` hangs for 10 seconds then sends SIGKILL. |

**Stub systemctl during image build.** `Dockerfile.base` replaces `/bin/systemctl` with a stub (a shell script that no-ops `daemon-reload` and returns success) during the build phase. Without this, `systemctl daemon-reload` called by package install scripts fails because there is no systemd running during `docker build`. The real `systemctl` is restored in the final layer before the test container starts.

**Removing conflicting units.** Some systemd units present in a standard Debian install conflict with container operation (udev, socket-based units, local-fs mount dependencies). These are removed during `Dockerfile.base` build with `rm -f` on the unit files, preventing systemd from attempting to activate them on container start.

**`systemctl exit $EXIT_STATUS`.** `entrypoint.sh` calls `systemctl exit $EXIT_STATUS` after goss validation completes. This signals PID 1 (systemd) to exit with a specific code, which becomes the container exit code. `just test-*` targets capture this code and surface pass/fail to the caller.

**`PassEnvironment` in service units.** systemd service units do not inherit Docker environment variables by default. The `ccr.service` unit uses `PassEnvironment=` to explicitly pass through variables set in the Docker run environment. Without `PassEnvironment`, those variables are invisible to the services even though they were set with `-e` in `docker run`.

**Phase-based testing via `STARTUP_STOP_AFTER`.** `startup.sh` checks the `STARTUP_STOP_AFTER` environment variable at key checkpoints and exits early when the value matches the current phase. This enables `just test-env` (stop after env file and SSH key are written), `just test-ccr` (stop after CCR starts and port 3456 is verified), and `just test-full` (run to completion). The pre-commit hook for `startup.sh` runs `just test-ccr` rather than `just test-full` because it is fast enough for commit-time feedback and covers the majority of boot logic.

**Docker Compose secrets.** Real secrets for `just test-real` are injected via Docker Compose's `secrets:` mechanism. Secret files are mounted read-only at `/run/secrets/<name>` inside the container. This is preferable to environment variables for secrets because:
- Files at `/run/secrets` are not visible in `docker inspect` output.
- They are not in the process environment and won't appear in accidental env dumps.
- File permissions can be narrowed to the owning user.

The mock server reads secrets at `/run/secrets/<name>` and returns them in responses that mimic the Secret Manager API format.

**Mock server design.** `vm/test/mock-server.py` listens on port 8080, intercepted by `startup.sh` via the `META_URL` and `SECRET_MANAGER_URL` environment variables. It serves:
- Instance metadata (project ID, instance attributes, git user name/email)
- Service account token endpoint (synthetic bearer token)
- Secret Manager `accessSecretVersion` endpoint (reads from `/run/secrets/<name>`, returns base64-encoded content in the Secret Manager response envelope)

The mock enforces the `Metadata-Flavor: Google` header (returning 403 without it), matching the real GCE server's contract. This prevents tests from accidentally passing against a more permissive mock while failing in production.

### Key patterns and gotchas

- **Isolate slow from fast.** The two-image pattern is the critical architectural choice. Without it, every change to `entrypoint.sh` triggers a 10-minute rebuild.
- **Use `STARTUP_STOP_AFTER` for development iteration.** `just test-env` gives sub-60-second feedback. Only run `just test-real` when the full lifecycle needs verification.
- **Docker Compose secrets over env vars for any credential.** Even dummy secrets in `just test` should go through the secrets mechanism to keep the pattern consistent with `just test-real`.
- **Always test `just test-real` before a packer build.** Dummy secrets validate control flow; real secrets validate the actual credential fetch and service configuration.
- **Masking units and setting `STOPSIGNAL` must be in the base image.** If only done in the test harness `Dockerfile`, a cached `just build-base` hit silently gives you the wrong base. The pre-commit hook enforcing `just validate-image` on `vm/image/services/` changes guards against exactly this.
- **`Metadata-Flavor: Google` header enforcement.** The mock enforces this header, matching real GCE behavior. A mock that doesn't enforce it will let `startup.sh` pass locally while potentially failing in production.

---

## The Testing Tiers

The validation strategy is layered by cost and scope, matching the right tool to the right phase of development:

**Tier 0 — `just verify` (pre-flight, no Docker).** Syntax checks on shell scripts (`bash -n`), permission assertions (`startup.sh` must be executable), key file presence checks, and a secret pattern scan against tracked files. Runs in seconds.

**Tier 1 — `just validate-image` (static image checks).** `dgoss` runs goss against the base image without booting systemd. Validates that all binaries are present and on PATH, all service unit files are written to the correct locations. Triggered by the `goss-image-validate` pre-commit hook. Fast — no container startup beyond `docker run`.

**Tier 1 — `just test-env` / `just test-ccr` (phase tests, dummy secrets).** Full Docker-plus-systemd boot, stopped at a phase boundary. `test-env` validates env file, SSH key, and git config. `test-ccr` additionally validates CCR config and port 3456. Uses dummy secrets — GitHub SSH auth fails intentionally (no real key). The `startup-integration-test` pre-commit hook runs `just test-ccr` on `startup.sh` changes.

**Tier 2 — `just test-real` (full lifecycle, real secrets).** Full boot with real credentials from `terraform.tfvars`. GitHub SSH auth succeeds, repositories are cloned, all services start. Required before any packer build.

**Tier 3 — `just scan` (CVE scan).** Trivy scans the base image after `just build-base`. Run after the image passes Tier 1 validation and before `packer build`. Blocking gate on `HIGH` and `CRITICAL` severity.

The tiers form a pipeline. Normal development iteration: `just test-ccr` → fix → iterate. Pre-packer-build sequence:

```bash
just build-base
just validate-image
just test-real
just scan
# then: packer build
```

---

## Composition & Workflow

**At commit time**, pre-commit runs the relevant subset of gates automatically. The hook evaluation order is:

1. `hadolint` — any Dockerfile change (fast, seconds)
2. `scan-secrets` — always, scoped to `git ls-files` (fast)
3. `gen-tools-context` — only on `setup.sh` or `Brewfile` changes (fast)
4. `goss-image-validate` → `just validate-image` — on image-layer changes (moderate, requires Docker)
5. `startup-integration-test` → `just test-ccr` — on `startup.sh` or test Dockerfile changes (slow, full systemd boot)

A commit touching `startup.sh` runs hooks 2, 5. A commit touching `Dockerfile.base` runs hooks 1, 2, 4. A commit touching only `terraform/` runs hook 2 only. The file-pattern scoping ensures each commit pays only for the checks that are relevant.

**For manual iteration**, the `just` targets map to stages of development:

```
just build-base        # after setup.sh or service unit changes
just validate-image    # verify image-layer state
just test-env          # iterate on early startup logic
just test-ccr          # iterate on CCR/secret fetch logic
just test-fresh        # force full no-cache rebuild when cache may be stale
just test-real         # full lifecycle gate before packer build
just scan              # CVE gate before packer build
```

**In CI** (if wired), `pre-commit run --all-files` covers Tiers 0 and 1. Tier 2 (`test-real`) requires real secrets and is typically a manual or scheduled gate rather than per-commit.

The mock server is the enabling technology for CI-friendliness: `just test-ccr` with dummy secrets requires no GCP credentials, no network access to GCP, and no service account. The entire boot path through CCR startup is testable in any environment with Docker.

---

*Reference files: `vm/test/Dockerfile.base`, `vm/test/Dockerfile`, `vm/test/entrypoint.sh`, `vm/test/mock-server.py`, `vm/test/goss-image.yaml`, `vm/test/goss-env.yaml`, `vm/test/goss-ccr.yaml`, `vm/test/goss-runtime.yaml`, `vm/test/docker-compose.yml`, `.pre-commit-config.yaml`, `Justfile`.*
