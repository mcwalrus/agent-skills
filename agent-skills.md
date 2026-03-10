
NOTE: this was the previous skills attempt.

# Agent skills (Cursor and Claude)

The articles under `./.agent-skills/ .../` are generated as **skills** for Cursor and Claude code agents. Each skill embeds the full article content, so it is self-contained and works when copied or symlinked into other projects (e.g. `~/.claude/skills/`). ./.agent-skills/ ... remains the canonical source; the generator reads from it but the generated skills do not reference or link back to ./.agent-skills/ ....

## Where skills live

- **In this repo**: `.cursor/skills/` — one directory per article (e.g. `.cursor/skills/support-pricing/SKILL.md`).
- **Cursor**: Uses these automatically as **project skills** when this repo is open. No extra setup.
- **Claude**: Reads skills from `~/.claude/skills/`. To use the same skills, symlink or copy from this repo (see below).

## Regenerating skills

Skills are generated from `./.agent-skills/ .../`. After adding or editing articles (or changing titles/excerpts), regenerate:

```bash
yarn generate-skills
```

This overwrites existing files under `.cursor/skills/` and is safe to run repeatedly.

## Using these skills with Claude

**Option A — Symlinks (recommended)**  
From the repo root:

```bash
./scripts/sync-claude-skills.sh
```

This creates symlinks in `~/.claude/skills/` to each directory under `.cursor/skills/`, so Claude sees the same skills and they stay in sync when you run `yarn generate-skills`.

**Option B — Manual symlink**  
Link a single skill, e.g.:

```bash
ln -s "$(pwd)/.cursor/skills/support-pricing" ~/.claude/skills/support-pricing
```

**Option C — Copy**  
Copy the contents of `.cursor/skills/` into `~/.claude/skills/`. You’ll need to copy again after regenerating.

## Image paths in articles

Articles may reference images with paths like `/posts/support/pricing/gbs_feed_price.png`. Those assets are served by the docs site; in the repo they typically live under `public/` (or the path used by your static build). When an agent reads an article file, image paths are as in the markdown; resolve them relative to the repo if needed.
