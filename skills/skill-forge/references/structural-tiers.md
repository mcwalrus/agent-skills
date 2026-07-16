# Structural Tiers for Agent Skills

Guidance for determining a skill's structural tier and authoring its supporting
files. Read this when Phase 3 of skill-forge requires a tier decision.

---

## The Four Tiers

Choose the lowest tier that meets the skill's needs. Start at Tier 1 and
escalate only when SKILL.md alone cannot hold the content or the agent needs
to execute code. When the tier is ambiguous, prefer the lower tier.

**Example tier determination output (Phase 3):**

> Tier: 2. The skill needs a reference doc for jurisdiction-specific clause
> library that would push SKILL.md over 500 lines and is only relevant for
> one sub-task. Supporting files:
> - `references/clause-library-nz.md` — read by agent during contract
>   drafting; not executed.
> No scripts or assets required.

### Tier 1 — Prompt Only

```
my-skill/
  SKILL.md
```

**Use when:** All knowledge fits in the prompt. No executable code needed.
Agent needs instructions and constraints only.

**Examples:** brand-guidelines, frontend-design, doc-coauthoring, most
meta-skills with a single focused workflow.

---

### Tier 2 — Prompt + Examples or Assets

```
my-skill/
  SKILL.md
  examples/
    example-1.md
    example-2.md
  assets/
    template.js
    viewer.html
```

**Use when:** The skill needs reference patterns the agent should follow or
adapt — desired output samples, structural templates, data files, schemas.

**Escalate from Tier 1 when:** SKILL.md says "produce output like X" but
cannot include a concrete example inline without exceeding the body size limit.

**Examples:** algorithmic-art (templates), internal-comms (output examples),
theme-factory (theme variants).

---

### Tier 3 — Prompt + Scripts + Reference Docs

```
my-skill/
  SKILL.md
  references/
    domain-knowledge.md
    implementation-guide.md
  scripts/
    process.py
    validate.sh
```

**Use when:** The skill requires executable tooling the agent runs, or
substantial factual reference material only needed for specific sub-tasks.

**Escalate from Tier 2 when:** The agent needs to execute code, not just read
or adapt content — or when reference content is large enough that loading it
always would waste context on irrelevant sub-tasks.

**Examples:** pdf, mcp-builder, skills with complex domain reference (legal
clauses, API schemas, language specs).

---

### Tier 4 — Multi-Component System

```
my-skill/
  SKILL.md
  references/
  assets/
  scripts/
    core/
    validators/
  agents/
    analyzer.md
    comparator.md
```

**Use when:** The skill spans multiple implementation variants, requires formal
validation infrastructure, or delegates to multiple named sub-agents.

**Escalate from Tier 3 when:** Scripts have enough internal structure to
warrant a module hierarchy, or when the skill needs distinct sub-agent prompts
for different roles.

**Examples:** an SDK reference skill (by-language variants), docx/pptx/xlsx (schema
validators + helpers + per-format structure), skill-creator (agent roles).

---

## Supporting File Role Distinctions

The directory name signals the agent's relationship to the file:

| Directory | Agent relationship | Contents |
|---|---|---|
| `scripts/` | Agent **runs** these | Python, Shell, JS — executable |
| `references/` | Agent **reads** these | Markdown docs — factual reference |
| `assets/` | Agent **adapts** these | Templates, schemas, data files, fonts, images |
| `examples/` | Agent **emulates** these | Desired output samples |
| `agents/` | Agent **delegates** to these | Sub-agent prompt files |

Never mix roles within a directory. A Python file that is referenced but not
executed belongs in `references/` (or just inline in SKILL.md). An output
example that is also a template belongs in `assets/` with customization
markers, not `examples/`.

---

## Decomposition Patterns for Reference Docs

When factoring reference material out of SKILL.md, choose a decomposition
pattern that matches the content's natural structure:

| Pattern | Use when | Structure |
|---|---|---|
| **By language variant** | Same concept, multiple implementations | `python/`, `typescript/`, `go/` + `shared/` for cross-cutting |
| **By concern** | Distinct bodies of knowledge for distinct sub-tasks | `best-practices.md`, `implementation-guide.md`, `evaluation-criteria.md` |
| **By actor** | Different sub-agents or roles | `agents/analyzer.md`, `agents/comparator.md` |
| **By output type** | Each file represents a different output format | `slack-announcement.md`, `internal-memo.md` |
| **By variant** | Each file is one instance of a parameterised type | `themes/dark.md`, `themes/light.md` |

---

## File Naming Conventions

- Lowercase with hyphens: `error-codes.md`, `prompt-caching.md`
- Descriptive and specific — never generic names like `guide.md`, `notes.md`,
  `reference.md`, `data.md`
- Framework/library names preserved: `pptxgenjs.md`, `stripe-sdk.md`
- Role-based for agent files: `analyzer.md`, `comparator.md`, `grader.md`
- Scripts: verb-noun or noun-action: `validate-schema.py`, `convert-pdf.sh`

---

## Script Conventions

Every script must be independently interpretable from its first few lines.

**Python:**

```python
#!/usr/bin/env python3
"""One-line purpose statement.

Extended description of what the script does.
Usage: python script.py [args]
"""

import os          # Standard library first
import json

import requests   # Third-party second

from .utils import helper  # Local imports last
```

**Shell:**

```bash
#!/bin/bash
set -e

# Purpose description in comments
```

---

## Asset Bundling Rules

- Bundle all assets inside the skill directory — never fetch at runtime
- Binary assets (fonts, schemas, UI components) are included directly as files
- Large binary bundles: package as `.tar.gz` if the uncompressed form would
  exceed ~10MB or contain many files
- Schemas: include as `.xsd`, `.json`, or `.yaml` — whichever the agent reads
- Self-containment is required: skills are distributed individually; a skill
  that depends on files outside its own directory tree breaks on install

---

## Reusing Existing Skills

A skill does not need to re-implement behaviour that already exists in another
skill. When the target harness offers a skill-invocation mechanism, reference
existing skills by name in the SKILL.md body:

> "Invoke a sentinel/gate-check skill (e.g. creative-sentinel) to gate-check the output."
> "Run a trust-audit skill on the draft before presenting it to the user."

This is preferable to duplicating the logic inline. The referenced skill is
loaded at invocation time — no bundling or copying is required. On harnesses
without a skill-invocation mechanism, run the equivalent behaviour inline.

Use this pattern when the skill needs: planning passes, gate-checking,
trust auditing, skills auditing, or any other behaviour an existing skill
already provides.
