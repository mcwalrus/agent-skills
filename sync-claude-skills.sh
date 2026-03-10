#!/usr/bin/env bash
# Creates symlinks in ~/.claude/skills/ to each skill under .cursor/skills/
# so Claude Code can use the same skills as Cursor. Run from repo root.

set -e
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CURSOR_SKILLS="${REPO_ROOT}/.cursor/skills"
CLAUDE_SKILLS="${HOME}/.claude/skills"

if [[ ! -d "$CURSOR_SKILLS" ]]; then
  echo "No .cursor/skills directory. Run: yarn generate-skills"
  exit 1
fi

mkdir -p "$CLAUDE_SKILLS"
for dir in "$CURSOR_SKILLS"/*/; do
  name=$(basename "$dir")
  target="${CLAUDE_SKILLS}/${name}"
  if [[ -L "$target" ]]; then
    rm "$target"
  elif [[ -d "$target" ]]; then
    echo "Skip (existing dir): $name"
    continue
  fi
  ln -s "$dir" "$target"
  echo "Linked: $name"
done
echo "Done. Claude skills synced from .cursor/skills/"
