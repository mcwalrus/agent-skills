---
name: mcp-setup
description: >
  Set up MCP servers, LSP backends, and Claude Code monitors — interactive and
  security-first. Stage 1 (MCP): install MCP servers to the right scope.
  Stage 2 (LSP): walk through pylsp, typescript-language-server, rust-analyzer,
  and gopls. Stage 3 (Monitors): create or edit monitor configs that observe
  Claude's behavior. Use when the user says "set up MCP servers", "install MCP",
  "set up LSP", "install pylsp", "install gopls", "set up monitors", "add a
  monitor", "configure Claude Code plugins", or invokes /mcp-setup. For
  read-only review of what is installed, use /mcp-setup audit — trigger on
  "audit MCP", "review my plugins", "what have I installed", "review my
  monitors", or "what plugins are enabled".
user-invocable: true
---

# MCP Setup

Set up MCP servers, LSP backends, and Claude Code monitors — with the right configuration in the right place.

---

## Dispatch

Route based on the invocation:

| Invocation | Command file |
|---|---|
| `/mcp-setup` (no args) | `commands/auto.md` |
| `/mcp-setup auto` | `commands/auto.md` |
| `/mcp-setup global` or `/mcp-setup user` | `commands/global.md` |
| `/mcp-setup project` or `/mcp-setup team` | `commands/project.md` |
| `/mcp-setup local` | `commands/local.md` |
| `/mcp-setup lsp` or "set up LSP" or "install pylsp / gopls / rust-analyzer / typescript-language-server" | `commands/lsp.md` |
| `/mcp-setup monitors` or "add a monitor" or "set up monitors" or "configure monitors" | `commands/monitors.md` |
| `/mcp-setup audit` or "audit MCP" or "review my plugins" or "what have I installed" or "review my monitors" | `commands/audit.md` |
| Natural language ("set up MCP", "install MCP", etc.) | `commands/auto.md` |

---

## Security Cross-Cutting Rules

These apply to every command path without exception:

- **Never run system-level installers automatically.** Present the exact command and wait for the user to run it themselves. This includes `brew`, `curl | sh`, `cargo install`, `npm install -g`, `pip install`, and `pipx install`.
- **Present before writing.** Before writing any config file (`.claude.json`, `.mcp.json`, `.claude-plugin/plugin.json`, `monitors/monitors.json`), show the user the full proposed file content and wait for explicit confirmation.
- **Audit monitors before enabling.** Monitor configs run automatically on every session — mistakes have wide blast radius. The monitors walkthrough includes a mandatory read-only validation step before any file write.
- **No hardcoded credentials.** Any config that requires an API key or token must use `${ENV_VAR}` placeholders. Never write literal credentials to any file.

---

## Cross-Cutting Rules (MCP)

These apply to every MCP command path:

### Prerequisite Check (before any MCP install)

Before executing any installation, load `references/prerequisites.md` and run the dependency checks for the servers being installed. If any dependency is missing:

1. State which MCP needs it
2. Show the exact install command
3. Ask the user to run it
4. Wait for confirmation
5. Re-check the dependency

**Never install system dependencies automatically.** Present the command and wait.

### Completion Output (after any successful MCP install)

After every successful MCP installation, load `references/verification.md` and follow the MCP Verification section:

1. Present a summary table of what was registered — include server name, scope, and one-line capability description for each installed server.

2. Instruct: *"Restart Claude Code, then run `/mcp` to confirm servers are connected."*

### Scope Guidance

When unsure which scope to use, or when the user asks, load `references/scoping.md` for the decision tree and summary table.

---

## Reference Files

| File | Purpose |
|---|---|
| `references/prerequisites.md` | MCP and LSP dependency check tables and installer commands |
| `references/mcp-catalog.md` | What each MCP does, why it's recommended, what's excluded |
| `references/scoping.md` | Three-scope model, decision tree, summary table |
| `references/verification.md` | Post-install verification for MCP, LSP, and monitors |
| `references/lsp-catalog.md` | LSP backend details: check, install, verify for each language |
| `references/monitors-guide.md` | Monitor schema, trigger types, action types, examples |
| `references/infrastructure-testing.md` | hadolint, goss/dgoss, trivy, pre-commit patterns, and systemd-in-Docker harness — load when the user asks about Dockerfile CI, container image validation, CVE scanning, or VM image test infrastructure |

## Command Files

| File | Purpose |
|---|---|
| `commands/auto.md` | Default: probe environment, recommend, confirm, delegate (MCP only) |
| `commands/global.md` | Install MCPs to `~/.claude.json` (all projects) |
| `commands/project.md` | Write/update `.mcp.json` (team-shared, committed) |
| `commands/local.md` | Install MCPs with `--scope local` (personal, per-project) |
| `commands/lsp.md` | LSP backend walkthrough: PATH check → install if absent → verify |
| `commands/monitors.md` | Monitor walkthrough: plugin dir check → draft → validate → write |
| `commands/audit.md` | Read-only audit: plugin inventory, MCP list, monitor review, summary |
