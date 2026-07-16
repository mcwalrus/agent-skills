# Global Installation

Install MCP servers to `~/.claude.json` with `--scope user`. These servers are available in every project on this machine.

**Important:** Global MCPs are stored in `~/.claude.json` under a top-level `mcpServers` key. This is **not** `~/.claude/settings.json`.

---

## Before Starting

1. Load `references/prerequisites.md` and verify all dependencies for the servers being installed.
2. Confirm scope with the user: *"These will be registered globally — available in every Claude Code session on this machine."*

---

## Server Installation Commands

### rust-mcp-server

**Prerequisites:** `cargo` must be available.

```bash
# Step 1: Install the binary
cargo install rust-mcp-server
```

Ask the user to confirm before running `cargo install`. This compiles from source and may take a minute.

```bash
# Step 2: Register with disabled tools that shell covers
claude mcp add --scope user rust-mcp-server -- rust-mcp-server \
  --disable-tool cargo-build \
  --disable-tool cargo-run
```

**After registration, note:** *"cargo-build and cargo-run are disabled — shell handles these. To re-enable, remove those --disable-tool args from ~/.claude.json."*

---

## After All Installs

Load `references/verification.md` and present the verification steps and completion summary.
