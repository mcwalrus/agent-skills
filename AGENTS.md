# Agent Skills

Personal agent skills maintained by Max Collier. Skills follow the
[Agent Skills](https://agentskills.io/) format.

## Adding a skill

Skills live at `skills/<skill-name>/SKILL.md` directly in the repo root. Each
skill is a directory containing:

- `SKILL.md` (required) — the skill instructions with YAML frontmatter
- `references/`, `scripts/`, `assets/` (optional) — supporting files

See [agentskills.io/specification](https://agentskills.io/specification) for
the full format.

## Conventions

- Skill `name` field must match its directory name (kebab-case)
- Keep descriptions under 1024 characters and trigger-focused
- Run validation before committing if the script is present
- Place supporting files in `references/` (docs), `scripts/` (code), or
  `assets/` (templates, data)

## License

MIT — see `LICENSE`.