# MCP Scoping: Global vs Project vs Local

Claude Code resolves MCP servers from three scopes, applied in priority order:

```
Local (personal, per-project — not committed)
  ↓ overrides
Project (.mcp.json at project root — committed, team-shared)
  ↓ overrides
User/Global (~/.claude.json — personal, all projects)
```

Higher-priority scopes win on conflicts. Additive keys (new server names) from all scopes are merged — a project can add servers on top of globals without removing them.

---

## File Locations

| Scope | File | Committed? | Who sees it |
|---|---|---|---|
| User/Global | `~/.claude.json` | No | You, on this machine, in every project |
| Project (team) | `.mcp.json` at project root | Yes | Everyone who checks out the repo |
| Local (personal) | `~/.claude.json` keyed to project path | No | You only, in this project |

**Important:** Global MCPs live in `~/.claude.json` under a top-level `mcpServers` key. This is **not** `~/.claude/settings.json` — that file is silently ignored for MCP configuration.

---

## Decision Tree

```
Does this MCP apply to every project on my machine?
├── YES → ~/.claude.json  (User/Global)
│         Examples: rust-mcp-server (Rust-primary machine)
│
└── NO → Does it apply to this project for the whole team?
         ├── YES → .mcp.json at project root  (committed)
         │         Examples: database MCPs, internal API MCPs,
         │                   project-specific tool servers
         │
         └── NO → Is it just for you on this project?
                  └── YES → claude mcp add --scope local
                             Examples: credential-bearing MCPs,
                                       experimental MCPs under test,
                                       personal debug servers
```

---

## Scope Summary Table

| MCP | Global | Project | Local |
|---|:---:|:---:|:---:|
| rust-mcp-server (Rust-primary machine) | ✓ | | |
| rust-mcp-server (mixed-language project) | | ✓ | |
| Database MCP (dev DB, no creds in config) | | ✓ | |
| Internal API MCP (team tooling) | | ✓ | |
| Any MCP with hardcoded credentials | | | ✓ |
| Experimental / personal debug MCP | | | ✓ |

---

## Rules

- **Never commit credentials.** If a server config needs an API key or token, use `${ENV_VAR}` placeholders in `.mcp.json` so the value is read from the developer's environment at runtime.
- **Never put personal paths in committed config.** Paths like `/Users/yourname/...` break for other developers. Use env vars or relative paths.
- **Keep global config lean.** Every registered MCP adds to the agent's context overhead. Only register globally what genuinely benefits every session.
