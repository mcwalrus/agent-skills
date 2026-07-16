# Auto Setup

Default path when invoked with no arguments. Probe the environment, recommend servers, confirm with the user, then delegate to the appropriate scope command.

---

## Step 1: Environment Probe

Run these commands to detect the development environment:

```bash
uname -s                                    # OS (Darwin, Linux)
command -v rustup                           # Rust toolchain
command -v go                               # Go toolchain
command -v python3                          # Python toolchain
command -v node                             # Node/TypeScript toolchain
ls Cargo.toml go.mod pyproject.toml package.json tsconfig.json 2>/dev/null   # project file signals
```

Record what is present. This determines which servers and LSP backends to recommend.

---

## Step 2: Build Recommendation

Apply this decision logic based on the probe results:

**Conditionally recommend:**
- rust-mcp-server — only if `rustup` is present OR `Cargo.toml` / `.rs` files detected
  - If Rust appears to be the primary language (majority of project files are Rust, or this is a Rust-only project): recommend **global** scope
  - If Rust is one of several languages in the project: recommend **project** scope (`.mcp.json`)

If no servers match the environment, say so and ask the user if they have a specific server in mind.

**Never recommend without being asked:**
- Filesystem MCP (covered by shell)
- GitHub MCP (excluded by preference)
- Any server that requires a paid API key or external service

---

## Step 3: Confirm with User

Before installing anything, present the recommendation as a table. Example for a Rust project:

```
Based on your environment, I recommend:

| Server          | Scope   | Reason                                     |
|-----------------|---------|---------------------------------------------|
| rust-mcp-server | global  | Structured cargo diagnostics (Rust primary) |

Shall I proceed with this setup? You can add, remove, or change the scope of any server.
```

If nothing was detected, ask: *"No environment-specific servers matched. Do you have a specific MCP server you'd like to install?"*

Wait for the user to confirm or adjust before proceeding.

---

## Step 4: Prerequisite Check

Load `references/prerequisites.md` and run the dependency checks for the confirmed servers. If anything is missing, follow the installer presentation flow — present the command, wait for the user, re-check.

Do not proceed to installation until all prerequisites are satisfied.

---

## Step 5: Delegate to Scope Commands

For each confirmed server:
- Global scope servers: follow `commands/global.md`
- Project scope servers: follow `commands/project.md`
- Local scope servers: follow `commands/local.md`

---

## Step 6: Verify and Summarize

After all installations complete, load `references/verification.md` and present the completion summary.
