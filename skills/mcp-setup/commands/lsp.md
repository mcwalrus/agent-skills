# LSP Setup

Walk the user through installing language server backends. This walkthrough is language-specific and interactive — it checks what is already present before suggesting any install.

---

## Security Checklist

Before doing anything else, confirm these rules are active for this walkthrough:

- **Never run system-level installers yourself.** Present every install command and wait for the user to run it.
- **Never skip the PATH check.** If the binary is already present, do not suggest reinstalling it.
- **Present one language at a time.** Do not bulk-install across languages without per-language confirmation.

---

## Step 1: Language Selection

Ask the user which language(s) they want LSP support for. Present the supported options:

```
Which language(s) do you want LSP support for?

  1. Python   (pylsp)
  2. TypeScript / JavaScript   (typescript-language-server)
  3. Rust   (rust-analyzer)
  4. Go   (gopls)
  5. Other

You can select multiple. If you are unsure, I can probe your environment to detect which languages are present.
```

If the user wants environment probing, run:
```bash
ls Cargo.toml go.mod pyproject.toml package.json tsconfig.json 2>/dev/null
command -v rustup; command -v go; command -v python3; command -v node
```
Use the probe results to recommend which backends apply.

If the user selects **Other**, go to the [Other Languages branch](#other-languages) below.

---

## Step 2: Per-Language PATH Check and Install

For each selected language, run in order:

### Python — pylsp

**PATH check first:**
```bash
python3 -c "import pylsp; print('ok')" 2>&1
```

- If output is `ok`: "pylsp is already installed. No action needed."
- If error: pylsp is absent. Present the install path (do not run it):

```bash
pipx install python-lsp-server
```

Explain: "Run this command. It installs pylsp in an isolated environment and puts it on PATH."

Ask the user to confirm they have run it, then re-check:
```bash
python3 -c "import pylsp; print('ok')" 2>&1
```

Load `references/lsp-catalog.md` for the full pylsp entry if the user wants optional extras or has a complex Python setup.

---

### TypeScript / JavaScript — typescript-language-server

**PATH check first:**
```bash
command -v typescript-language-server
```

- If found: "typescript-language-server is already installed. No action needed."
- If not found: present the install command:

```bash
npm install -g typescript typescript-language-server
```

Explain: "Both packages are needed — the language server depends on the TypeScript compiler. Run this command, then confirm."

After confirmation, re-check:
```bash
command -v typescript-language-server
```

If the re-check fails, check whether `npm`'s global bin directory is on PATH:
```bash
npm root -g
```
Present the PATH fix if needed and load `references/lsp-catalog.md` for the TypeScript entry.

---

### Rust — rust-analyzer

**PATH check first (rustup path):**
```bash
rustup component list --installed | grep rust-analyzer
```

- If found: "rust-analyzer is already installed via rustup. No action needed."
- If not found, check for a standalone install:

```bash
command -v rust-analyzer
```

- If found via PATH: "rust-analyzer is available. No action needed."
- If absent: present the install command:

```bash
rustup component add rust-analyzer
```

Explain: "This adds rust-analyzer as a rustup component — the recommended way. Run this command, then confirm."

After confirmation, re-check:
```bash
rustup component list --installed | grep rust-analyzer
```

Load `references/lsp-catalog.md` for the Rust entry if the user has a non-rustup Rust setup.

---

### Go — gopls

**PATH check first:**
```bash
command -v gopls
```

- If found: "gopls is already installed. No action needed."
- If not found: present the install command:

```bash
go install golang.org/x/tools/gopls@latest
```

Explain: "This installs gopls to your GOPATH/bin. Run this command, then confirm."

After confirmation, re-check:
```bash
command -v gopls
```

If the re-check fails, check the GOPATH/bin PATH situation:
```bash
echo $PATH | grep -q "$(go env GOPATH)/bin" && echo "on PATH" || echo "not on PATH"
```

If GOPATH/bin is not on PATH, present the fix:
```bash
# Add to ~/.zshrc or ~/.bashrc:
export PATH="$(go env GOPATH)/bin:$PATH"
```
Ask the user to add this, reload their shell, then re-check.

---

## Step 3: Verification Close

After all selected languages are handled, present a summary:

```
LSP Backend Summary:

| Language   | Backend                    | Status  |
|------------|----------------------------|---------|
| Python     | pylsp                      | ✓ Ready |
| TypeScript | typescript-language-server | ✓ Ready |
| Rust       | rust-analyzer              | ✓ Ready |
| Go         | gopls                      | ✓ Ready |
```
(Adjust the table to match only the languages that were selected and their actual status.)

Load `references/verification.md` and present the LSP Verification section.

Then say: "Restart Claude Code to pick up the changes."

---

## Other Languages

If the user selects "Other" or names a language not in the four above:

Say:

> "This walkthrough covers Python, TypeScript, Rust, and Go. For other languages, locate the LSP-compliant language server binary for your language (e.g., `clangd` for C/C++, `zls` for Zig) and install it according to that project's docs."

Stop here. Do not attempt to scaffold any config file for the custom LSP.
