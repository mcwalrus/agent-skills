# Project Installation

Write or update `.mcp.json` in the current project directory. This config is committed to the repo — every team member who clones it gets these servers automatically.

---

## Before Starting

1. Confirm the current directory is a project root. Check for any of: `.git/`, `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`. If none found, warn the user and ask if they want to proceed anyway.

2. Load `references/prerequisites.md` for any servers that need local binaries (e.g., rust-mcp-server requires `cargo`).

3. Check for an existing `.mcp.json`. If present, read it and merge non-destructively — do not overwrite existing entries.

---

## What Belongs in Project Scope

Load `references/scoping.md` for the full decision tree. In short:

- **Database MCPs** — the dev database the team uses (credentials via env var placeholders)
- **rust-mcp-server** — when Rust is one of several languages in a mixed project
- **Internal API / tool MCPs** — team-specific deployment tools, staging API bridges
- **Any project-specific MCP** that all team members need

**Do not add to project scope:**
- Anything with hardcoded credentials
- MCPs that depend on personal local paths
- Global-scope MCPs that every developer should install themselves

---

## Template Entries

### rust-mcp-server (for a Rust project or subdirectory)

```json
{
  "mcpServers": {
    "rust-mcp-server": {
      "command": "rust-mcp-server",
      "args": [
        "--disable-tool", "cargo-build",
        "--disable-tool", "cargo-run"
      ]
    }
  }
}
```

If Rust code lives in a subdirectory (e.g., `./rust-service`), add `"--workspace", "./rust-service"` to the args array.

### Database MCP (guided)

Ask the user:
1. *"What database does this project use for development?"* (Postgres, MySQL, etc.)
2. *"What environment variable holds the connection string?"* (e.g., `DEV_DATABASE_URL`)

Then generate the entry with an env var placeholder:

```json
{
  "mcpServers": {
    "postgres-dev": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DEV_DATABASE_URL}"
      }
    }
  }
}
```

### Custom / Internal MCP (guided)

Ask the user for: server name, command, args, and any env vars. Generate the entry.

---

## Writing the Config

1. If `.mcp.json` exists: read it, merge the new entries under `mcpServers`, preserve everything else.
2. If `.mcp.json` does not exist: create it with the new entries.
3. **Before saving:** show the user the full file content and ask them to confirm it looks correct.
4. After writing, remind: *"Commit `.mcp.json` to share with the team. Never commit credentials — use `${ENV_VAR}` placeholders."*

---

## Reminders

- *"Global-scope MCPs come from each developer's `~/.claude.json` automatically. Do not add them here unless you need to override a team member's config."*
- *"The `${ENV_VAR}` syntax reads from the developer's environment at runtime — the config is safe to commit, the credential is not."*

---

## After Writing

Load `references/verification.md` and present the verification steps.
