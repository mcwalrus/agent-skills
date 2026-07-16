# Prerequisites

Before installing MCP servers or LSP backends, check that required dependencies are present. The agent must never install system dependencies itself — present the command and wait for the user to confirm.

---

## MCP Prerequisites

### Dependency Table

| Dependency | Check command | Required for | Install command |
|---|---|---|---|
| `jq` | `command -v jq` | JSON merge (script fallback) | `brew install jq` |
| `cargo` | `command -v cargo` | rust-mcp-server | `curl https://sh.rustup.rs -sSf \| sh` |

### Which MCP Deps to Check

- **Only if Rust detected:** `cargo` (required for rust-mcp-server)

### Node Version Check

If `node` is present, verify the major version is >= 18:

```bash
node --version   # expect v18.x or higher
```

If the version is below 18, present the upgrade path (`nvm install 20` or `brew upgrade node`) and stop.

---

## LSP Prerequisites

Check each backend only when the corresponding language is detected in the environment probe or explicitly requested by the user.

### Dependency Table

| Dependency | Check command | Required for | Install command |
|---|---|---|---|
| `rust-analyzer` | `rustup component list --installed \| grep rust-analyzer` | LSP (Rust) | `rustup component add rust-analyzer` |
| `gopls` | `command -v gopls` | LSP (Go) | `go install golang.org/x/tools/gopls@latest` |
| `pylsp` | `python3 -c "import pylsp"` | LSP (Python) | `pipx install python-lsp-server` |
| `typescript-language-server` | `command -v typescript-language-server` | LSP (TS) | `npm install -g typescript typescript-language-server` |

### Which LSP Deps to Check

- **Only if Rust detected:** `rust-analyzer`
- **Only if Go detected:** `gopls`
- **Only if Python detected:** `pylsp`
- **Only if TypeScript detected:** `typescript-language-server`

For a dedicated LSP walkthrough covering PATH checks, install flows, and language-specific notes, use `commands/lsp.md` or load `references/lsp-catalog.md`.

---

## Installer Presentation Flow

For each missing dependency, follow this flow exactly:

1. State which server or backend needs it and why
2. Show the exact install command from the table above
3. Ask the user to run the command themselves
4. Wait for the user to confirm it is installed
5. Re-run the check command to verify
6. If still missing after re-check: stop, explain what went wrong, offer to continue later

**Critical rule:** The agent never runs system-level installers (brew, curl|sh, cargo install, npm install -g, pip install, pipx install) on its own. It presents the command and waits. The user decides when and how to install system tooling.
