---
name: gc-setup
description: >
  Install, configure, and validate a gascity city — covering all required
  dependencies (gc, dolt, bd, flock, tmux) and initialising a minimal working
  city.toml with at least one agent. Runs in guide mode (explains each step)
  or install mode (executes setup autonomously after probing the environment).
  Use when: "install gascity", "set up a gascity city", "how do I get started
  with gc", "configure gas city", or /gc-setup.
  Do NOT trigger for designing automations in an existing city — use
  automations-engineer for that. Do NOT trigger for MCP server setup — use
  mcp-setup for that. Do NOT trigger for CI guardrails — use bootstrap-ci.
user-invocable: true
---

# Gas City Setup

Install and validate a working gascity city — all required dependencies probed and installed, a minimal `city.toml` authored, and the controller running. Covers the full path from zero to `gc status` showing a healthy city.

Run in **guide mode** (explain each step, user executes) or **install mode** (probe environment then execute setup autonomously). Ask the user which mode they prefer before proceeding unless the conversation context makes it clear.

Success: `gc status` returns without error and `gc doctor` passes.

## Values

- **Probe before install.** Check what is already present before touching the system. Do not reinstall or downgrade dependencies that already meet minimum versions.
- **Validate each step.** After each install, verify the dep is present and meets the minimum version before proceeding to the next.
- **Minimum viable city.** The output is the smallest working city: one agent, a beads provider, a daemon block. Do not add complexity beyond what the user needs to start.
- **Platform-aware.** macOS and Linux have different install paths for some deps. Detect the platform and use the correct commands.

## Constraints

- Never install or modify system dependencies without user confirmation in guide mode.
- Never skip validation after each dependency install — a dep that "should be there" is not the same as one that is.
- Never author a `city.toml` that references agents, formulas, or features the user has not asked for.
- If a required dep cannot be installed (no package manager, corp policy), document what is missing and stop cleanly — do not continue to city init with known missing deps.
- On any failure, report exactly which steps completed and which failed. The user can re-run from the last successful step — do not re-run steps that already passed.

## Workflow

### Research Phase — Fetch Current gascity Documentation

Before probing the environment, invoke `/tech-doc-research` via the Skill tool on the gascity GitHub repository:

> "Research https://github.com/gastownhall/gascity — focus on: current required dependencies and minimum versions, all supported installation methods (Homebrew, binary, source), minimum city.toml configuration, gc CLI commands for init/start/status/doctor, and any version-specific setup considerations."

Use the research output throughout this skill. Where it conflicts with the embedded instructions below, the research takes precedence — it reflects the current release. The embedded dep table and config snippets are defaults; treat them as fallbacks if the research is inconclusive.

### Step 0 — Mode and Platform

Before anything else:
1. **Mode** — guide (explain each step, user executes) or install (agent probes and executes). Ask if not clear from context.
2. **Platform** — run `uname -s` to detect macOS (`Darwin`) vs Linux. Install commands differ.
3. **Existing state** — probe before any install:
   ```bash
   which gc && gc status --help 2>&1 | head -1
   which dolt && dolt version
   which bd && bd --version
   which flock && flock --version
   tmux -V
   git --version
   jq --version
   lsof -v 2>&1 | head -1
   pgrep --version 2>&1 | head -1
   ```
   Report what is present, what version, and what is missing.

### Step 1 — Install Required Dependencies

Required dependencies in install order:

| Dependency | Min version | macOS | Linux | Check |
|---|---|---|---|---|
| `git` | any | pre-installed | `apt install git` | `git --version` |
| `jq` | any | `brew install jq` | `apt install jq` | `jq --version` |
| `tmux` | any | `brew install tmux` | `apt install tmux` | `tmux -V` |
| `lsof` | any | pre-installed | `apt install lsof` | `lsof -v 2>&1 \| head -1` |
| `pgrep` | any | pre-installed | `apt install procps` | `pgrep --version` |
| `flock` | any | `brew install flock` | pre-installed (util-linux) | `flock --version` |
| `dolt` | ≥ 1.86.1 | `brew install dolt` | see dolthub.com/get | `dolt version` |
| `bd` (beads) | ≥ 1.0.0 | see Step 1b | see Step 1b | `bd --version` |
| `gc` (gascity) | any | see Step 1c | see Step 1c | `which gc` |

After each install, run the check command and confirm it succeeds. Version mismatches on `dolt` (< 1.86.1) or `bd` (< 1.0.0) are blocking — upgrade before continuing.

**Step 1b — Install `bd` (beads):**

`bd` is not in Homebrew. In install mode, discover the correct asset and download it:

```bash
# Discover available release assets
gh release view --repo gastownhall/beads --json assets -q '.assets[].name'
```

Read the asset list. Identify the binary matching the current platform (`darwin` or `linux`) and architecture (`arm64` or `amd64`/`x86_64` — check with `uname -m`).

```bash
# Download the matching asset (substitute actual asset name from list above)
gh release download --repo gastownhall/beads --pattern "<matching-asset-name>" --dir /tmp/bd-install
chmod +x /tmp/bd-install/bd
sudo mv /tmp/bd-install/bd /usr/local/bin/bd
```

In guide mode: direct the user to `github.com/gastownhall/beads/releases`, download the binary for their platform and architecture, move to `/usr/local/bin/bd`, and `chmod +x`.

Verify: `bd --version` must show ≥ 1.0.0.

**Step 1c — Install `gc` (gascity):**

```bash
brew tap gastownhall/gascity
brew install gastownhall/gascity/gascity
```

If Homebrew is unavailable, direct the user to `github.com/gastownhall/gascity` for alternative install methods. Do not infer a module path or build command.

Verify: `which gc` confirms the binary is on PATH. Use `gc status --help` or `gc --help` to confirm the binary responds — the exact version flag may differ between releases.

### Step 2 — Initialize the City

Once all deps pass validation:

```bash
gc init <path>
```

Ask the user for the city path if not provided. Suggest `~/cities/<project-name>` as a sensible default.

`gc init` creates the city directory, generates a starter `city.toml`, creates `.gc/` runtime state, and registers the city with the machine-wide supervisor.

Verify: `gc status` should return without error after init.

### Step 3 — Configure city.toml

Review the generated `city.toml` with the user. Confirm the minimum required sections are present:

```toml
[workspace]
name = "<city-name>"

[[agent]]
name = "worker"
prompt_template = "agents/worker/prompt.template.md"

[daemon]
patrol_interval = "30s"

[beads]
provider = "bd"
```

Confirm with the user:
1. **Agent name** — what will this agent do? Name it accordingly.
2. **Session provider** — default is tmux (leave `[session]` unset). For subprocess or container environments, set `[session] provider = "subprocess"`.
3. **Beads provider** — `"bd"` (dolt-backed) is the production default. For quick testing without dolt: `GC_BEADS=file` environment variable bypasses dolt entirely.

Create a minimal prompt template at the configured path if one does not exist:

```
agents/<agent-name>/prompt.template.md
```

A one-line placeholder is enough to pass validation. Note: the city will start and `gc doctor` will pass with a placeholder template, but the agent will not perform meaningful work until the prompt is properly authored. Authoring the agent prompt is outside the scope of this skill.

### Step 4 — Start and Validate

```bash
gc start
gc status
gc doctor
```

`gc start` registers with the supervisor and starts the controller loop.

Verify each command succeeds. Common failure modes:
- **dolt not running** → run `gc beads health` to diagnose
- **tmux not found** → install tmux, retry `gc start`
- **port conflict on 9443** → add `[api] port = <other-port>` to city.toml

### Step 5 — Smoke Test

Confirm the beads store is working end to end:

```bash
bd create --title "Setup smoke test" --type task
bd list
bd close <id from list output>
```

If `bd create` succeeds and the task appears in `bd list`, the city is working.

## Output Format

After completion, deliver:
1. **Dependency status** — table of each dep, installed version, pass/fail
2. **City location** — path to the initialised city
3. **Validation summary** — `gc status`, `gc doctor`, smoke test result
4. **Next step** — "To build automations on this city, invoke `/automations-engineer`."

## Transitions

Once `gc status` is clean and the smoke test passes, this skill is done. For building automations on the running city, invoke `/automations-engineer`.

If the user asks about MCP server configuration for agents in the city, use mcp-setup for that.
