# Agent Skills

Personal agent skills maintained by Max Collier. Skills follow the
[Agent Skills](https://agentskills.io/) format and are installable via
the vercel-labs/skills CLI:

```bash
npx skills add mcwalrus/agent-skills
```

## Source relationship

This repo is a one-way mirror of `workflow-skills/skills/mcwalrus/`.
`workflow-skills` is the canonical source — edit skills there first,
then sync here.

```
workflow-skills (canonical)        mcwalrus/agent-skills (this mirror)
skills/mcwalrus/<cat>/<skill>/  →  skills/<skill>/
```

The categories (`agent-knowledge`, `gas-helpers`, `meta-skills`,
`technical`, `walt-disney`) are dropped during the flatten. The
original grouping lives in `workflow-skills` git history — refer to it
when you need the categorization back.

## When to sync

Re-sync this repo when any of these happen upstream:

- A new skill is added under `skills/mcwalrus/<category>/` or
  `skills/mcwalrus/` directly
- An existing skill's `SKILL.md` is edited
- A skill is renamed or moved between categories
- A skill is removed

The sync is one-way. Do not edit `SKILL.md` in both repos — if you find
divergence, treat `workflow-skills` as authoritative and re-sync.

## Sync procedure

Run from this repo's root:

```bash
SRC=/Users/max.collier/Projects/Max/workflow-skills/skills/mcwalrus
DEST=./skills

# 1. Walk source skill dirs, diff each against dest
find "$SRC" -name SKILL.md -exec dirname {} \; | sort -u | while read src; do
  name=$(basename "$src")
  if [ ! -d "$DEST/$name" ]; then
    echo "ADD:    $name"
    mkdir -p "$DEST/$name"
    cp -R "$src/." "$DEST/$name/"
  elif ! diff -q "$src/SKILL.md" "$DEST/$name/SKILL.md" >/dev/null 2>&1; then
    echo "UPDATE: $name"
    cp -R "$src/." "$DEST/$name/"
  fi
done

# 2. Check for skills removed upstream
for d in "$DEST"/*/; do
  name=$(basename "$d")
  if [ ! -f "$SRC/$name/SKILL.md" ] && \
     ! find "$SRC" -mindepth 2 -maxdepth 2 -type d -name "$name" -quit 2>/dev/null | grep -q .; then
    echo "REMOVE: $name (no longer in source)"
  fi
done
```

For each `ADD`/`UPDATE`: review the diff, then `git add` the affected
files. For each `REMOVE`: confirm in workflow-skills git history
(`git -C /Users/max.collier/Projects/Max/workflow-skills log -- "$SRC/<path>"`)
before `git rm`.

Then commit and push:

```bash
git add skills/
git diff --cached --stat
git commit -m "sync: <describe what changed in workflow-skills>"
git push
```

## Layout rules

- **Flat**: every skill is a direct child of `skills/`. Never recreate
  `skills/<namespace>/` subdirectories.
- **Kebab-case**: directory names use lowercase, numbers, and hyphens.
  The `name:` frontmatter field must match the directory name.
- **Required**: `SKILL.md` with valid YAML frontmatter, description
  under 1024 characters.
- **Optional**: `references/`, `scripts/`, `assets/` per skill — copy
  these from source, they survive the flatten.

## Validation

Before committing a sync, verify each touched skill:

```bash
# Check name field matches directory name
for d in skills/*/; do
  name=$(basename "$d")
  fm_name=$(awk '/^name:/{print $2; exit}' "$d/SKILL.md")
  [ "$name" = "$fm_name" ] || echo "MISMATCH: $name vs $fm_name"
done

# Check description length
for f in skills/*/SKILL.md; do
  desc_len=$(awk '/^description:/{flag=1; next} flag && /^---/{exit} flag' "$f" | tr -d '\n' | wc -c)
  [ "$desc_len" -lt 1024 ] || echo "LONG DESC: $f ($desc_len chars)"
done
```

For a full spec check, see
[agentskills.io/specification](https://agentskills.io/specification).

## Conflict handling

The flat layout means skill names must be globally unique within this
repo. If `workflow-skills` ever has two skills with the same basename
in different categories:

1. Pick the more general/useful one to migrate
2. Rename the other in `workflow-skills` first
3. Then sync

Do not introduce prefixes or nested directories to resolve collisions —
the flat layout is the whole point of this mirror.

## Don'ts

- Don't re-introduce `skills/mcwalrus/` or other namespace directories
- Don't edit `SKILL.md` in both repos — pick one source of truth
- Don't modify skill content during sync — copy verbatim
- Don't add CI/CD or release tooling without checking first — this
  repo is intentionally minimal

## License

PolyForm Noncommercial 1.0.0 — see `LICENSE`.