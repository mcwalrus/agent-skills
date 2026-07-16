# Local Installation

Install MCP servers with `--scope local` — personal, per-project, stored in `~/.claude.json` keyed to the current project path. Not committed to the repo. Not visible to teammates.

---

## When to Use Local Scope

- **Credential-bearing MCPs** — servers that need a hardcoded API key or token you don't want in the repo
- **Experimental MCPs** — testing a server before proposing it to the team
- **Personal debug servers** — custom tools for your own workflow in this project
- **MCPs with personal paths** — anything referencing `/Users/yourname/...`

---

## Installation Command

```bash
claude mcp add --scope local <server-name> -- <command> [args...]
```

**Examples:**

```bash
# A personal debug MCP
claude mcp add --scope local my-debug-server -- /path/to/my/debug-mcp

# A credential-bearing MCP (key in the command, not committed)
claude mcp add --scope local my-api -- npx -y @some/mcp-server --api-key sk-xxx

# An experimental MCP under evaluation
claude mcp add --scope local experimental-tool -- node /path/to/experimental/server.js
```

---

## Flow

1. **Explain the scope:** *"Local scope is personal and tied to this directory. It will not affect other projects or teammates. The config is stored in `~/.claude.json` keyed to this project path — nothing is written to the project directory."*

2. **Ask what the user wants to install.** If they have a specific MCP in mind, build the command with them. If they're unsure, ask:
   - What does the server do?
   - What command starts it?
   - Does it need any arguments or environment variables?

3. **Run the `claude mcp add --scope local` command.**

4. **Verify:** Load `references/verification.md` and confirm the server appears in `/mcp` output with local scope.

---

## Promoting Local to Project or Global

If the user has been testing a local MCP and wants to share it with the team:

1. Remove the local registration: `claude mcp remove --scope local <server-name>`
2. Follow `commands/project.md` to add it to `.mcp.json` (remove any hardcoded credentials, use env var placeholders)

If they want to make it global across all projects:

1. Remove the local registration: `claude mcp remove --scope local <server-name>`
2. Follow `commands/global.md` to add it to `~/.claude.json`
