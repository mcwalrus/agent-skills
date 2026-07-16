# Post-Install Verification

Run the relevant verification section after each installation type to confirm everything is connected and working.

---

## MCP Verification

Run this after any MCP server installation.

### Verification Steps

1. **Restart Claude Code** (or reload the window) for new servers to connect.

2. **Run `/mcp` inside Claude Code.** Every registered server should appear as connected. Check the output for:
   - Server name
   - Connection status (connected vs failed)
   - Scope (user, project, local)

3. **CLI verification** (alternative):
   ```bash
   claude mcp list
   ```

### Troubleshooting Failed MCP Connections

| Symptom | Likely cause | Fix |
|---|---|---|
| Server shows as "failed" | Missing binary or dependency | Check prerequisites — the command in the MCP config must be on PATH |
| Server not listed at all | Config in wrong file | Verify the entry is in `~/.claude.json` (global) or `.mcp.json` (project), not `~/.claude/settings.json` |
| Server connects then disconnects | Crash on startup | Run the server command manually in a terminal to see error output |
| "command not found" in error | Binary not installed or not on PATH | Install the binary, then verify with `command -v <binary>` |

### First-Use Notes

**rust-mcp-server:**
- Tools are available immediately after connection.
- `cargo-build` and `cargo-run` are disabled by default (shell covers these).
- To re-enable disabled tools, remove the `--disable-tool` args from the MCP config in `~/.claude.json`.

### Completion Summary Template

After a successful MCP install run, present this to the user:

```
Registered MCP servers:

| Server | Scope | Key capabilities |
|--------|-------|-----------------|
| <name> | <scope> | <one-line description> |

Next: restart Claude Code, then run /mcp to confirm servers are connected.
```

Adjust the table to match what was actually installed.

---

## LSP Verification

Run this after installing any LSP backend.

### Verification Steps

1. **Confirm the binary is on PATH:**

   | Backend | Verification command |
   |---|---|
   | pylsp | `python3 -c "import pylsp; print('ok')"` |
   | typescript-language-server | `typescript-language-server --version` |
   | rust-analyzer | `rust-analyzer --version` |
   | gopls | `gopls version` |

2. **Restart Claude Code** for the language server to be picked up.

### Troubleshooting Failed LSP Backends

| Symptom | Likely cause | Fix |
|---|---|---|
| Language server binary not found | Backend not on PATH | Run the verification command for that backend manually; check PATH |
| `pylsp` not found after install | pipx bin dir not on PATH | Check `~/.local/bin` is on PATH; add to `.zshrc` if needed |
| `gopls` not found after install | GOPATH/bin not on PATH | Add `export PATH="$(go env GOPATH)/bin:$PATH"` to shell profile |
| `typescript-language-server` not found | npm global bin not on PATH | Run `npm root -g` to find global bin dir; add to PATH |
| rust-analyzer not found | Rustup component not installed or wrong toolchain | Run `rustup component add rust-analyzer` and verify with `rustup component list --installed \| grep rust-analyzer` |

---

## Monitor Verification

Run this after writing or updating a monitors configuration file.

### Verification Steps

1. **Confirm the file was written** to the correct location:
   ```bash
   cat monitors/monitors.json         # if using dedicated file
   cat .claude-plugin/plugin.json     # if declared inline
   ```
   Verify the `monitors` array contains the expected entries with `name`, `command`, and `description` fields.

2. **Restart Claude Code** for the monitor to take effect. Monitors start at session start — changes to the config file do not apply mid-session.

3. **Live test (optional):** In a new session, check the task panel for the monitor's name. If the monitor command produces output, you should see notifications from Claude acknowledging what was observed. For a log watcher, append a line to the watched log and confirm Claude receives it.

### Troubleshooting Monitors

| Symptom | Likely cause | Fix |
|---|---|---|
| Monitor does not start | Claude Code version below v2.1.105 | Update with `npm install -g @anthropic-ai/claude-code` |
| Monitor not in task panel | Config file not found or invalid JSON | Confirm file is at `monitors/monitors.json` or inline in `.claude-plugin/plugin.json`; validate JSON syntax |
| Monitor starts then immediately stops | Command exits instead of running indefinitely | Wrap in a loop: `while true; do your-command; sleep 10; done` |
| No notifications from monitor | Command is silent / buffered stdout | Add `--line-buffered` to grep, or use `stdbuf -oL` prefix; confirm command prints to stdout not stderr |
| Monitor does not start with `on-skill-invoke` | Skill name mismatch | `when: "on-skill-invoke:<name>"` uses the skill's `name` frontmatter field exactly — check it matches |
