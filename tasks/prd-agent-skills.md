# PRD: agent-skills

## Introduction

`agent-skills` is a lightweight npm CLI tool that lets individual developers define their working style, conventions, and preferences once — then automatically syncs them to every AI coding agent they use. Instead of maintaining separate config files for Cursor and Claude Code, you write your skills in one place and `agent-skills` handles translation and distribution.

**Target user:** Individual developers using both Cursor and Claude Code who want a single source of truth for their AI agent behavior.

---

## Goals

- Provide a single unified source format (Markdown) for skills, rules, and suggestions
- Automatically translate source files into native formats for Cursor (`.cursor/rules/*.mdc`) and Claude Code (`CLAUDE.md`)
- Enforce sync integrity via a lockfile (`agent-skills.lock`) suitable for CI
- Provide a clean CLI with `init`, `sync`, `check`, `validate`, and `help` commands
- Keep configuration minimal — one config file at `~/.agent-skills/config.json`
- Ship as a TypeScript package usable as a dev dependency, global install, or via `npx`

---

## Semantic Definitions

| Type | Meaning | Example |
|---|---|---|
| **Skills** | How-to behaviors — teach the agent *how* to do things | "When writing tests, always use Vitest" |
| **Rules** | Hard constraints — things the agent must or must not do | "Never commit directly to main" |
| **Suggestions** | Soft preferences — style guidance the agent should follow | "Prefer arrow functions over function declarations" |

---

## User Stories

### US-001: Initialize the ~/.agent-skills directory
**Description:** As a developer, I want to run `agent-skills init` so that my global skills directory is created with the correct structure and a starter config.

**Acceptance Criteria:**
- [ ] `agent-skills init` creates `~/.agent-skills/` if it doesn't exist
- [ ] Creates subdirectories: `skills/`, `rules/`, `suggestions/`
- [ ] Creates `~/.agent-skills/config.json` with default values if not present (does not overwrite existing)
- [ ] Prints a success summary listing what was created
- [ ] Exits with code 0 on success, non-zero on failure

---

### US-002: Generate GUIDE.md on init --guide
**Description:** As a developer, I want to run `agent-skills init --guide` so I get a reference document explaining the difference between skills, rules, and suggestions, and how each agent format works.

**Acceptance Criteria:**
- [ ] `agent-skills init --guide` generates `~/.agent-skills/GUIDE.md`
- [ ] GUIDE.md explains: skills vs rules vs suggestions (with examples)
- [ ] GUIDE.md documents the Cursor `.mdc` format and how it maps to source files
- [ ] GUIDE.md documents the Claude Code `CLAUDE.md` format and how it maps to source files
- [ ] Does not overwrite an existing GUIDE.md without `--force` flag
- [ ] Typecheck passes

---

### US-003: Write a skill/rule/suggestion source file
**Description:** As a developer, I want a documented source file format so I know exactly how to write skills that will translate correctly.

**Acceptance Criteria:**
- [ ] Source files are Markdown (`.md`) with optional YAML frontmatter
- [ ] Frontmatter supports `type` (`skill` | `rule` | `suggestion`), `name`, `description`, `targets` (`cursor` | `claude` | `all`)
- [ ] Files without a `targets` field are skipped during sync (no implicit output) — `validate` warns about missing `targets`
- [ ] Files without a `type` field default to `skill`
- [ ] GUIDE.md documents the format with examples
- [ ] Typecheck passes

---

### US-004: Sync source files to Cursor format
**Description:** As a developer, I want `agent-skills sync` to translate my source files into Cursor's `.mdc` format so Cursor picks them up automatically.

**Acceptance Criteria:**
- [ ] `agent-skills sync` runs `validate` first; aborts with validation errors if any file is invalid
- [ ] Reads all files from `~/.agent-skills/skills/`, `rules/`, and `suggestions/`
- [ ] For each file targeting `cursor` or `all`, generates a corresponding `.mdc` file under `.cursor/rules/` in the current working directory
- [ ] Output `.mdc` files include valid frontmatter (`description`, `alwaysApply`) derived from source frontmatter
- [ ] File names are kebab-cased from the source filename
- [ ] Existing `.mdc` files are overwritten (they are generated artifacts)
- [ ] Typecheck passes

---

### US-005: Sync source files to Claude Code format
**Description:** As a developer, I want `agent-skills sync` to translate my source files into `CLAUDE.md` so Claude Code picks them up automatically.

**Acceptance Criteria:**
- [ ] For files targeting `claude` or `all`, content is appended/merged into `CLAUDE.md` in the current working directory
- [ ] Each skill/rule/suggestion is written as a clearly demarcated section in `CLAUDE.md` with a generated header comment indicating it was auto-generated
- [ ] Re-running sync replaces only the auto-generated sections, preserving any manually written content in `CLAUDE.md`
- [ ] Typecheck passes

---

### US-006: Generate and update the lockfile
**Description:** As a developer, I want a lockfile that records the hash of every source file and its generated output so I can detect drift.

**Acceptance Criteria:**
- [ ] `agent-skills sync` writes/updates `agent-skills.lock` in the current working directory
- [ ] Lockfile contains: source file path, source hash (SHA-256), generated output path, output hash, timestamp
- [ ] Lockfile is JSON with a stable, deterministic key order
- [ ] Typecheck passes

---

### US-007: Check sync status (CI enforcement)
**Description:** As a developer, I want `agent-skills check` to verify that all generated files match the lockfile so I can fail CI when they're out of sync.

**Acceptance Criteria:**
- [ ] `agent-skills check` reads `agent-skills.lock` and re-hashes all source and output files
- [ ] If all hashes match: prints "All files are in sync." and exits with code 0
- [ ] If any hashes differ: prints a list of out-of-sync files with human-readable reasons (source changed, output missing, output modified), then exits with code 1
- [ ] If `agent-skills.lock` is missing: prints an actionable error ("Run `agent-skills sync` first") and exits with code 1
- [ ] Typecheck passes

---

### US-008: Validate source files
**Description:** As a developer, I want `agent-skills validate` to check my source files for format errors before syncing.

**Acceptance Criteria:**
- [ ] `agent-skills validate` reads all files in `~/.agent-skills/skills/`, `rules/`, `suggestions/`
- [ ] Reports files with invalid frontmatter (unknown keys, invalid `type` values, invalid `targets` values)
- [ ] Reports empty files (no content beyond frontmatter)
- [ ] If all files are valid: prints "All source files are valid." and exits with code 0
- [ ] If errors exist: prints each error with filename and line number where possible, exits with code 1
- [ ] Typecheck passes

---

### US-009: Print help to stdout
**Description:** As a developer, I want `agent-skills help` to print command documentation to stdout so I can quickly reference usage.

**Acceptance Criteria:**
- [ ] `agent-skills help` prints usage for all commands: `init`, `sync`, `check`, `validate`, `help`
- [ ] Each command entry includes: name, description, flags/options, example invocation
- [ ] `agent-skills help <command>` prints detailed help for a single command
- [ ] Output is plain text (no ANSI color required, but allowed)
- [ ] Typecheck passes

---

### US-010: Install and invoke as npm package
**Description:** As a developer, I want to use `agent-skills` as a dev dependency, global install, or via `npx` so it fits into any project setup.

**Acceptance Criteria:**
- [ ] `npm install --save-dev agent-skills` + `npx agent-skills <cmd>` works
- [ ] `npm install -g agent-skills` + `agent-skills <cmd>` works
- [ ] `npx agent-skills <cmd>` works without prior install
- [ ] `package.json` defines a `bin` entry pointing to the CLI entrypoint
- [ ] Typecheck passes

---

## Functional Requirements

- **FR-1:** CLI entrypoint must be a compiled JavaScript file with a proper shebang (`#!/usr/bin/env node`)
- **FR-2:** Config file location is fixed at `~/.agent-skills/config.json`; the tool must not read config from the current working directory
- **FR-3:** Source files are always read from `~/.agent-skills/{skills,rules,suggestions}/`
- **FR-4:** Output files are always written relative to the current working directory (`./`)
- **FR-5:** The Cursor adapter must produce valid `.mdc` files accepted by Cursor's latest rules format (`.cursor/rules/`)
- **FR-6:** The Claude Code adapter must produce a `CLAUDE.md` that merges generated sections without destroying manually-written content
- **FR-7:** `agent-skills.lock` must be committed to version control; `.gitignore` must NOT include it
- **FR-8:** All CLI commands must print actionable error messages (never silent failures)
- **FR-9:** The package must be written in TypeScript with `strict: true`
- **FR-10:** The test suite uses Vitest; ESLint and Prettier are enforced

---

## Non-Goals

- No support for other AI agents beyond Cursor and Claude Code (e.g., GitHub Copilot, Windsurf) in v1
- No GUI or web dashboard
- No cloud sync or remote storage of skills
- No auto-discovery of projects — the user runs `sync` explicitly per project
- No Cursor legacy `.cursorrules` format support
- No Claude Code global `~/.claude/CLAUDE.md` output (only project-level `CLAUDE.md`)
- No real-time file watching / daemon mode
- No encrypted or secret management features

---

## Technical Considerations

- **Runtime:** Node.js ≥ 18 (uses native `crypto` for SHA-256, `fs/promises` throughout)
- **Build:** `tsc` compiles to `dist/`; `package.json` `main` points to `dist/index.js`, `bin` to `dist/cli.js`
- **Frontmatter parsing:** Use `gray-matter` for YAML frontmatter parsing
- **YAML serialization:** Use `js-yaml` (already a `gray-matter` dependency) for writing `.mdc` frontmatter — do not hand-roll YAML
- **Markdown handling:** Source files are passed through with minimal transformation; no markdown rendering required
- **Lockfile format:** JSON, sorted keys, pretty-printed via `JSON.stringify(obj, null, 2)` — no extra dependency
- **Cursor `.mdc` format:** YAML frontmatter block followed by Markdown body; `description` and `alwaysApply` are the primary frontmatter fields
- **CLAUDE.md merge strategy:** Delimit generated sections with `<!-- agent-skills:start:<slug> -->` and `<!-- agent-skills:end:<slug> -->` HTML comments; content outside these markers is preserved
- **CI integration:** `agent-skills check` exits with code 1 on any drift — wire into GitHub Actions / similar as a step after `agent-skills sync`
- **`sync` pre-flight:** `sync` runs `validate` internally before writing any output; if validation fails, sync aborts and prints validation errors
- **`targets` default:** Files without a `targets` frontmatter field are **not** synced to any target; `targets` must be explicitly set to `cursor`, `claude`, or `all`

---

## Project Structure

```
agent-skills/
├── src/
│   ├── cli.ts              # CLI entrypoint (commander.js or manual arg parsing)
│   ├── index.ts            # Public API exports
│   ├── commands/
│   │   ├── init.ts
│   │   ├── sync.ts
│   │   ├── check.ts
│   │   ├── validate.ts
│   │   └── help.ts
│   ├── adapters/
│   │   ├── cursor.ts       # .mdc file generator
│   │   └── claude.ts       # CLAUDE.md merger
│   ├── lockfile.ts         # Read/write agent-skills.lock
│   ├── hasher.ts           # SHA-256 file hashing
│   └── types.ts            # Shared TypeScript types
├── tests/
│   ├── cursor.test.ts
│   ├── claude.test.ts
│   ├── lockfile.test.ts
│   └── validate.test.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── vitest.config.ts
└── package.json
```

---

## Success Metrics

- Developer can go from `npx agent-skills init` to a working `sync` in under 5 minutes
- `agent-skills check` reliably catches drift (source changed but sync not re-run) in CI
- No silent failures — every error path prints an actionable message
- All generated output files pass validation by their respective tools (Cursor loads `.mdc` rules, Claude Code reads `CLAUDE.md`)

---

## Resolved Decisions

| Question | Decision |
|---|---|
| Should `sync` auto-run `validate` first? | Yes — sync aborts on validation failure |
| Should the lockfile record the `agent-skills` version? | No — keep lockfile minimal (source/output hashes + timestamp only) |
| Should `targets` default to `all` or require explicit opt-in? | Explicit opt-in — files without `targets` are skipped and warned by `validate` |
| Which formatters/serializers to use? | `gray-matter` for frontmatter parsing, `js-yaml` for YAML output, native `JSON.stringify` for lockfile |
