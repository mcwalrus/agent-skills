# MCP Server Catalog

What each recommended MCP server does, why it earns its place, and what was excluded.

The bar for inclusion: **does it give the agent something structurally different from what shell access or CLAUDE.md instructions can produce?**

---

## Recommended Servers

### rust-mcp-server (opt-in)

**What it is:** An MCP that wraps the Cargo toolchain and exposes structured output from cargo check, clippy, test, add, cargo-machete, and cargo-hack.

**The case for it:**
- **Structured diagnostic output.** When `cargo clippy` runs via shell, the agent receives raw terminal text and must parse error messages. Via the MCP, it receives typed, structured data — producing more reliable fixes, especially for complex lifetime and borrow errors.
- **Tools agents get wrong unaided.** `cargo-machete` (unused dep detection) and `cargo-hack` (powerset feature testing) are consistently mis-invoked when agents construct cargo commands themselves. The MCP wraps these correctly.

**The case against it:** `cargo build`, `cargo run`, and basic `cargo test` are fine via shell. If Rust is occasional rather than primary, skip this.

**Recommended config — disable tools that shell covers:**
- Disabled: `cargo-build`, `cargo-run`
- Retained: `cargo-check`, `cargo-clippy`, `cargo-test`, `cargo-fmt`, `cargo-add`, `cargo-machete`, `cargo-hack`, `cargo-search`, `cargo-info`, `cargo-doc`

**Scope decision:**

| Situation | Scope |
|---|---|
| Rust is primary language, most projects are Rust | Global (`~/.claude.json`) |
| Rust is one of several languages, mixed projects | Per-project (`.mcp.json`) |
| Rust is occasional | Skip it |

