---
name: weave-skills
description: >
  Design and document orchestration skills that call other skills
  programmatically. Produces a wiring plan, interface contracts, and a
  SKILL.md brief for multi-skill workflows. Use when composing skills into
  pipelines ("compose these skills together", "wire skill A to skill B",
  "design an orchestration skill", "I want a skill that calls X then Y",
  "cross-pollinate this pattern into a new skill", "structure skill-to-skill
  handoffs"), or when an existing skill needs to adopt a proven calling
  pattern from another skill. Do NOT trigger for creating a single-purpose
  skill with no inter-skill calls — use skill-forge for that. Do NOT trigger
  for auditing existing skill relationships — use skill-graph for that.
user-invocable: true
---

# Skill Weave

Design orchestration skills that call other skills programmatically — composing them into pipelines with explicit interface contracts. Success is a wiring plan, a contract specification for each skill handoff, and a SKILL.md brief ready to pass to skill-forge for full production authoring.

Cross-pollination is a first-class goal: when a proven orchestration pattern (like creative-process's evaluation loop or skill-forge's phased gate structure) would serve the new skill's domain, surface it and adapt it rather than inventing from scratch.

## Values

- **Contracts before code.** Interface expectations must be defined before any SKILL.md draft is written. Silent mismatches between caller expectations and called skill output are the primary failure mode.
- **Proven patterns first.** Survey existing orchestration skills before designing a new wiring structure. Reuse what works.
- **Minimum viable wiring.** Prefer the simplest workflow that satisfies the outcome. Not every orchestration skill needs a sub-agent loop.
- **One idea per skill.** Skills gain scope as they mature. When a called skill has grown two purposes that serve different callers and never co-occur, flag it as a split candidate. Two operations within a single coherent workflow are not a split signal.

## Constraints

- Never design a wiring plan without first reading the SKILL.md of each skill being called. If a desired called skill is not yet installed, note it as a gap in the wiring plan, design the interface contract as-if the skill will exist, and flag the gap prominently in the brief.
- Never assume what a called skill produces — read its output description (Output Format section, or equivalent prose/section in the body).
- Never write a complete SKILL.md — produce a brief and hand off to skill-forge.

## Workflow

### Step 1 — Understand the desired orchestration

Clarify what the orchestrating skill is trying to achieve and which skills it should call, in what sequence, under what conditions. Read the SKILL.md of each candidate called skill before continuing. If a candidate skill does not exist, note the gap and continue — design the interface contract assuming the skill will exist, and flag it clearly in the brief.

As you read each skill's SKILL.md, classify it before applying the maturity check:

- **Pure** — single declared purpose, no inter-skill calls
- **Composed** — itself an orchestration that calls other skills

Then apply the maturity check appropriate to its type:

- **Pure skill:** Can you write two clean, one-sentence descriptions for genuinely different purposes — purposes that different callers invoke, never together? If yes, note it as a split candidate.
- **Composed skill:** Do its two pipelines serve entirely different callers, such that no caller ever needs both? If yes, note it as a split candidate. A composed skill orchestrating multiple steps toward one outcome is not a split signal.

A split candidate is a design observation, not a defect. Surface it; don't act on it mid-session.

### Step 2 — Survey orchestration patterns

Glob `~/.claude/skills/**/SKILL.md` and identify skills that call other skills via the Skill tool. Read their wiring structures and identify patterns applicable to this orchestration:

| Pattern | Example skill | Use when |
|---|---|---|
| Linear pipeline | skill-forge | A → B → C, each stage gates the next |
| Evaluation loop | creative-process | Run planner → sentinel until gate clears |
| Fan-out then merge | skills-audit | Parallel analysis dimensions, one report |
| Gate-then-branch | creative-process | Cleared gate triggers a different path |

Recommend at least one pattern for adoption or adaptation. If none fits, design from intent.

### Step 3 — Define interface contracts

For each skill-to-skill handoff, document:

```
Handoff: [caller] → [called skill]
Trigger condition: when the caller invokes the called skill
Expected output: what section/format/signals the caller reads
Verdict signals: specific strings that drive branching (e.g. "GATE: CLEARED")
Error surface: what happens if the called skill produces unexpected output
```

Every handoff must have a contract. An undocumented handoff is an unmitigated risk.

### Step 4 — Produce the wiring plan

Write a wiring diagram in pseudocode, using creative-process's format as a reference model:

```
orchestrating_skill:
  Step 1: /skill-a → produces [what]
  Step 2: read [signal from skill-a output]
    signal = X → Step 3
    signal = Y → Step 4
  Step 3: /skill-b → produces [what]
  ...
```

Present the wiring plan and contracts to the user before continuing.

If split candidates were flagged in Step 1, append a "Post-split topology (design annotation)" section to the wiring plan. For each candidate: if pure, show two atomic skills replacing one; if composed, show two separate orchestration trees. Label the section clearly — this is forward design, not a recommendation.

### Step 5 — Produce the SKILL.md brief

Write a brief (not a complete SKILL.md) for the orchestrating skill:
- Intended name
- One-paragraph intent statement
- List of skills called, with their interface contracts
- Wiring diagram
- Any flagged gaps (skills referenced that do not yet exist)
- Split candidates: for each flagged skill, its classification (pure/composed), the two purposes or pipelines identified, and which callers invoke each. Omit this bullet if no candidates were flagged.

Present the brief to the user for review. Do not invoke skill-forge without explicit user direction — the brief is their input to provide to skill-forge, not an automated handoff.

## Output

- **Wiring plan** — pseudocode diagram of all skill calls and branching conditions
- **Interface contracts** — one contract block per handoff
- **SKILL.md brief** — intent, name, wiring diagram, contracts, and flagged gaps in a brief ready for skill-forge

## Transitions

Hand off to `/skill-forge` to author the complete SKILL.md from the brief produced in Step 5. To audit existing inter-skill relationships and detect contract mismatches, use `/skill-graph`.
