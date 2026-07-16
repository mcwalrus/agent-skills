# LSP Server Catalog

Reference data for the four first-class LSP backends. Each entry covers: what the binary is, how to check if it is already present, how to install it if absent, and how to verify it is working.

---

## Python — `pylsp`

**What it is:** Python Language Server, a community fork of the original python-language-server. Provides definition lookup, reference finding, and symbol resolution for Python projects.

**Path check:**
```bash
python3 -c "import pylsp; print('ok')" 2>&1
```
If this prints `ok`, pylsp is installed. If it errors, it is absent.

**Alternative check (if Python env is complex):**
```bash
python3 -m pylsp --version 2>&1
```

**Install:**
```bash
pipx install python-lsp-server
```
Prefer `pipx` over `pip install --user` — it creates an isolated environment and puts `pylsp` on PATH without polluting the system Python. If `pipx` is not installed:
```bash
brew install pipx    # macOS
# or
pip install --user pipx
```

**Optional extras (for richer completions):**
```bash
pipx inject python-lsp-server pylsp-mypy python-lsp-black python-lsp-ruff
```
Only suggest extras if the user asks or if mypy/black/ruff are detected in `pyproject.toml`.

**Verify after install:**
```bash
python3 -m pylsp --version
```

**Notes:**
- `pylsp` does not have a separate marketplace step — it is a plain Python package.
- No additional config needed once the binary is on PATH.

---

## TypeScript — `typescript-language-server`

**What it is:** A TypeScript/JavaScript language server that wraps the TypeScript compiler's language services. Provides symbol resolution in `.ts`, `.tsx`, `.js`, and `.jsx` files.

**Path check:**
```bash
command -v typescript-language-server
```

**Install:**
```bash
npm install -g typescript typescript-language-server
```
Both `typescript` and `typescript-language-server` are needed — the language server depends on the compiler. If `npm` is not available, check Node installation first (Node >= 18 required).

**Verify after install:**
```bash
typescript-language-server --version
```

**Notes:**
- This is an npm package, not a VSCode marketplace plugin. There is no marketplace step.
- If the project uses a local `typescript` install (in `node_modules`), the language server will use the project's version — consistent with what VSCode would use.
- TypeScript and JavaScript share the same language server.

---

## Rust — `rust-analyzer`

**What it is:** The official Rust language server, distributed as a `rustup` component. Provides macro-expanded symbol resolution, trait implementations, and lifetime information.

**Path check:**
```bash
rustup component list --installed | grep rust-analyzer
```
If the output includes `rust-analyzer`, it is installed.

**Alternative PATH check (if installed via other means):**
```bash
command -v rust-analyzer
```

**Install (via rustup — preferred):**
```bash
rustup component add rust-analyzer
```

**Install (standalone binary — only if not using rustup):**
```bash
# macOS
brew install rust-analyzer
```
The standalone binary may lag behind the toolchain version. Prefer the `rustup` component when Rust is installed via rustup.

**Verify after install:**
```bash
rust-analyzer --version
```

**Notes:**
- `rust-analyzer` is a rustup component, not a crate to `cargo install`. Using `cargo install rust-analyzer` installs an older version — do not recommend this path.
- After `rustup component add`, the binary is at `~/.rustup/toolchains/<toolchain>/bin/rust-analyzer`. Rustup manages PATH automatically for its components.

---

## Go — `gopls`

**What it is:** The official Go language server, maintained by the Go team. Provides symbol resolution, call hierarchy, and reference finding for Go projects.

**Path check:**
```bash
command -v gopls
```

**Install:**
```bash
go install golang.org/x/tools/gopls@latest
```
Requires `go` to be installed. The binary lands in `$(go env GOPATH)/bin`, which should be on PATH.

**PATH check for GOPATH/bin:**
```bash
echo $PATH | grep -q "$(go env GOPATH)/bin" && echo "GOPATH/bin is on PATH" || echo "GOPATH/bin not on PATH"
```
If GOPATH/bin is not on PATH, present this fix:
```bash
# Add to ~/.zshrc or ~/.bashrc:
export PATH="$(go env GOPATH)/bin:$PATH"
```
Ask the user to add this and reload their shell before re-checking.

**Verify after install:**
```bash
gopls version
```

**Notes:**
- `gopls` does not have a marketplace step — it is a plain Go binary.
- No additional config needed once `gopls` is on PATH.
- If the user's project uses Go workspaces (`go.work`), gopls handles multi-module workspaces automatically.
