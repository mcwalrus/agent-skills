# Agent Skills

Personal agent skills maintained by Max Collier — these are private skills
used for my own productivity and aren't intended as a public catalogue.
Skills follow the [Agent Skills](https://agentskills.io/) format and can be
installed via the vercel-labs/skills CLI.

## Installation

```bash
npx skills add mcwalrus/agent-skills
```

Browse the skills in this repo under [`skills/`](./skills). Each subdirectory
contains a `SKILL.md` with the full description — the `npx skills` CLI
discovers them directly from the directory layout, so what you see here is
always the source of truth.

## Skill Structure

Each skill is a directory under `skills/` with:

- `SKILL.md` — the skill instructions with YAML frontmatter
- `references/`, `scripts/`, `assets/` (optional) — supporting files

See [agentskills.io/specification](https://agentskills.io/specification) for the full format.

## License

PolyForm Noncommercial 1.0.0 — see [LICENSE](./LICENSE).
