# Deno Commands

## Allow (safe, read-only or local)
- `Bash(deno test *)`
- `Bash(deno check *)`
- `Bash(deno lint *)`
- `Bash(deno fmt --check *)`
- `Bash(deno run --allow-read *)`
- `Bash(deno run --allow-net *)`
- `Bash(deno run --allow-env *)`
- `Bash(deno run --allow-write *)`
- `Bash(deno run --allow-run *)`
- `Bash(deno run --allow-all *)`
- `Bash(deno task *)`
- `Bash(deno compile *)`
- `Bash(deno info *)`
- `Bash(deno bench *)`

## Ask (modifies shared state)
- `Bash(deno install *)`
- `Bash(deno publish *)`
- `Bash(deno cache *)`
- `Bash(deno upgrade *)`

## Deny (destructive or overly broad)
- `Bash(deno uninstall *)`
- `Bash(deno run --allow-all *)` (in production contexts — prefer explicit flags)
