---
name: dev-env-bootstrap
description: >
  Scaffold `.claude/settings.json` and `.claude/settings.local.json` for
  permissive local development. Probes the repo to detect the tech stack
  (Node, Deno, Python, Go, Rust, Docker, Terraform, etc.) and generates an
  appropriately scoped allowlist plus universal deny rules. Use when the
  user says "bootstrap my claude dev setup", "setup claude permissions",
  "make claude permissive for local dev", "claude settings for this repo",
  "generate settings.json". Do NOT trigger for MCP server installation —
  use mcp-setup. Do NOT trigger for full CI pipeline setup — use
  bootstrap-ci. Do NOT trigger for ad-hoc permission tuning — use
  update-config.
user-invocable: true
---

# Dev Env Bootstrap

Quickly scaffold safe, permissive Claude Code settings for a new or existing
repository. Probes the codebase, detects the dominant tech stack, and writes
both the shared `settings.json` and the personal `settings.local.json`.

## Constraints

- NEVER write a `settings.json` that lacks a `deny` block.
- NEVER add `sudo`, `rm -rf /`, or force-push patterns to `allow`.
- If `settings.json` already exists, ask before overwriting.
- Keep all paths relative to the project root — no `~` expansion in `deny`.
- Prefer `ask` over `allow` for any command that modifies shared state.

## Workflow

1. **Scan the repo** for tech stack signatures:
   - `package.json` → Node / npm / pnpm / yarn
   - `deno.json` or `deno.jsonc` → Deno
   - `Cargo.toml` → Rust
   - `go.mod` → Go
   - `pyproject.toml`, `setup.py` → Python
   - `Dockerfile`, `docker-compose.yml` → Docker
   - `*.tf` → Terraform
   - `justfile`, `Makefile` → Just / Make
   - `beads/` or `.beads/` → beads issue tracker + dolt commands

2. **Build the shared `settings.json`** (committed to git):
   - Common `Read`, `Edit`, `Write` allowances scoped to the project.
   - Safe read-only Bash commands: ls, cat, grep, find, wc, head, tail.
   - Tech-specific safe commands from `references/<stack>-commands.md`.
   - Universal `deny` block (destructive git, system-wide rm, sudo, curl pipes).
   - `defaultMode: "acceptEdits"`.

3. **Build the local `settings.local.json`** (gitignored, personal allowances):
   - Git status/log/diff/branch/remote.
   - Package installs and updates (npm install, deno install, cargo add, go get, uv add).
   - WebFetch for docs and GitHub.
   - `WebSearch` and `Skill` invocation.
   - `EnterWorktree` and `ExitWorktree` for isolated work sessions.
   - `Agent`, `AskUserQuestion`, `CronCreate`, `CronDelete`, `CronList` for interactive and scheduled work.
   - `bd` and `dolt` commands when `beads/` or `.beads/` is detected.

4. **Write the files** to `.claude/settings.json` and `.claude/settings.local.json`.
   Confirm with the user before overwriting existing files.

## Output Format

Two JSON files. Example for a Rust + Just project:

`.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Read(*)", "Edit(*)", "Write(*)",
      "Bash(ls *)", "Bash(cat *)", "Bash(grep *)",
      "Bash(find *)", "Bash(wc *)", "Bash(head *)", "Bash(tail *)",
      "Bash(cargo test *)", "Bash(cargo nextest *)",
      "Bash(cargo clippy *)", "Bash(cargo check *)",
      "Bash(cargo fmt *)", "Bash(cargo build *)",
      "Bash(just test *)", "Bash(just lint *)", "Bash(just fmt *)",
      "Bash(just validate *)", "Bash(just ci *)",
      "Bash(* --version)", "Bash(* --help)"
    ],
    "deny": [
      "Bash(rm -rf /*)", "Bash(rm -rf ~*)",
      "Bash(git push --force *)", "Bash(git reset --hard *)",
      "Bash(git clean *)", "Bash(git stash drop *)",
      "Bash(git checkout -- *)", "Bash(git checkout .)",
      "Bash(sudo *)",
      "Bash(curl * | bash *)", "Bash(curl * | sh *)",
      "Bash(wget * | bash *)", "Bash(wget * | sh *)",
      "Bash(dolt push --force *)"
    ],
    "defaultMode": "acceptEdits"
  }
}
```

`.claude/settings.local.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(git status *)", "Bash(git log *)", "Bash(git diff *)",
      "Bash(git branch *)", "Bash(git remote *)",
      "Bash(cargo add *)", "Bash(cargo update *)",
      "Bash(rustup *)",
      "WebFetch(domain:docs.rs)", "WebFetch(domain:github.com)",
      "WebSearch", "Skill(*)",
      "EnterWorktree", "ExitWorktree",
      "Agent", "AskUserQuestion",
      "CronCreate", "CronDelete", "CronList",
      "Bash(bd *)", "Bash(dolt status)", "Bash(dolt log *)",
      "Bash(dolt diff *)", "Bash(dolt add *)", "Bash(dolt commit)",
      "Bash(dolt branch *)", "Bash(dolt checkout *)", "Bash(dolt sql *)",
      "Bash(dolt push *)", "Bash(dolt pull *)", "Bash(dolt version)"
    ]
  }
}
```

## Transitions

- If the user asks for MCP servers after settings are generated, invoke `mcp-setup`.
- If the user asks for CI hooks or pre-commit setup, invoke `bootstrap-ci`.
- If the user wants to add one-off permissions later, invoke `update-config`.
