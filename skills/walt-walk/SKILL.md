---
name: walt-walk
description: >
  Walk through an agent skill file from the perspective of an agent executor —
  inhabiting the skill step by step to surface ambiguities, assumed knowledge,
  missing context, decision points without guidance, and places where the agent
  would stall, guess, or go wrong. Use to audit a skill from the agent's inside
  view, find gaps only visible at execution time, or prepare a skill for deployment.
  Trigger on phrases like "walt walk", "walk this skill", "agent perspective audit",
  "how would an agent experience this", "inhabit this skill", "walk through as an
  agent", "execution audit", or any request to trace through a skill from the
  agent's point of view rather than the author's. Also trigger before deployment
  testing or when an agent has behaved unexpectedly and you want to understand why.
  Do NOT use for general skill quality review — use creative-critic for that, or
  skill-trust-audit for trust-calibration review.
---

# The Walt Walk

Walt Disney walked his park in disguise — at ground level, as a guest, without
the context of an executive. He found what no blueprint had shown him: where
guests hesitated, where signage failed, where the experience broke down between
the intention and the reality.

This is that walk. For agent skills.

You are not reading this skill as its author. You are not evaluating it as a
critic. You are **becoming the agent** — encountering the skill fresh, following
its instructions with only what the skill gives you, and narrating everything
that happens as you go.

---

## The Walk Discipline

The single most important rule of the Walt Walk:

> **You must narrate every interpretive move you make.**

An LLM reading a skill will silently fill gaps with world knowledge. The Walt
Walk makes those fills visible. Every time you assume something, infer something,
or resolve an ambiguity — you must say so, explicitly, before continuing.

The format for every interpretive move:

> *"[ASSUMPTION] I am assuming X means Y because Z. If this assumption is wrong,
> the agent would [consequence]."*

> *"[INFERENCE] The skill doesn't say what to do here. I am inferring [path]
> based on [context]. An agent without this context would [alternative outcome]."*

> *"[STALL] I cannot determine what to do here. The skill has not given me enough
> to proceed confidently. I am marking this as a STALL and continuing with
> [guess]."*

If you find yourself reading a line and simply understanding it — without any
interpretive move — continue. Not every step needs annotation. Only the moves
that are invisible in normal reading need to be made visible.

---

## Walk Preparation

Before beginning the walk, establish:

**1. What agent is executing this skill?**
Name the target agent type: a general-purpose agent like Claude, a specialised
coding agent, a tool-calling agent, etc. The assumed capabilities of the
executor change what counts as an acceptable gap.

**2. What context does the agent have at execution time?**
What will the agent know before the skill starts? What has happened in the
conversation? What tools are available? What has been passed in?

**3. What does success look like?**
State the expected output or outcome of a successful skill execution. This
becomes the reference point for evaluating whether gaps matter.

Establish these three things, then begin the walk.

---

## The Walk Itself

Move through the skill **section by section, instruction by instruction**. For
each section:

**Read it as the agent would encounter it** — with only what came before, not
what comes after.

**Narrate the agent's state:**
- What does the agent know at this point?
- What is it being asked to do?
- What decision, if any, does it need to make?

**Surface every interpretive move** using the formats above.

**Flag issues as you find them** using these markers:

| Marker | Meaning |
|---|---|
| `[ASSUMPTION]` | The agent must assume something not stated |
| `[INFERENCE]` | The agent must infer a path from incomplete guidance |
| `[STALL]` | The agent cannot proceed without guessing — real risk of wrong path |
| `[GAP]` | Something is missing that would have been useful |
| `[FRICTION]` | The instruction is technically followable but harder than it needs to be |
| `[OVERSTEP]` | The skill is telling the agent something it doesn't need to be told |

Do not stop at flags — continue the walk. The goal is a complete traversal, not
a list of blockers. Mark the issues and keep moving.

---

## Note-Taking During the Walk

Maintain a running **Walk Log** as you traverse the skill. For each flagged item,
record:

- **Location** — which section or instruction
- **Marker type** — ASSUMPTION / INFERENCE / STALL / GAP / FRICTION / OVERSTEP
- **What the agent encounters** — the specific ambiguity or issue
- **Consequence if unresolved** — what the agent does when it hits this, and
  whether that outcome is acceptable
- **Severity** — HIGH (agent likely fails or produces wrong output) / MEDIUM
  (agent proceeds but with degraded quality) / LOW (minor friction only)

---

## After the Walk

Once the full skill has been traversed, produce the **Walk Report**:

### Walk Summary
One paragraph: overall impression of the skill from the agent's perspective.
Was the walk smooth, rough, or broken? Where did the real problems cluster?

### Walk Log
The complete log of flagged items, organised by severity (HIGH first).

### Critical Path Analysis
Of all the flagged items, which ones sit on the critical path — the sequence
the agent *must* traverse successfully to produce the expected output? An
ASSUMPTION on a rarely-triggered branch is different from a STALL on the first
decision the agent makes.

### Invisible Knowledge Map
A summary of all the world knowledge, contextual assumptions, and inferences the
agent used that were not in the skill. This is what the author cannot see because
they already know it. This is what a different agent, or the same agent in a
different context, might not bring.

### Recommended Revisions
For each HIGH and MEDIUM severity finding: a specific, concrete suggested
revision to the skill text. Not general advice — actual proposed wording or
structural change.

---

## Handoff to Creative Sentinel

The Walt Walk is diagnostic. It finds; it does not gate.

Once the Walk Report is complete, if HIGH severity findings exist — particularly
STALLs on the critical path or ASSUMPTIONS with serious consequence if wrong —
**invoke creative-sentinel** with the Walk Report as input.

Frame the handoff clearly:

> *"The Walt Walk is complete. The following HIGH severity findings have been
> identified. Sentinel: determine whether these findings constitute blockers to
> deployment, or whether they are acceptable risks given the agent's reasoning
> capability and the stakes of the skill."*

The sentinel will apply its gate criteria. The Walt Walk provides the evidence;
the sentinel issues the verdict.

If no HIGH severity findings exist, the skill may proceed without sentinel review
— though a skill-trust-audit is recommended before deployment to assess whether the
remaining gaps represent appropriate agent delegation or unaddressed risk.

---

## A Note on Honest Walking

The temptation in this walk is to read charitably — to fill gaps silently, to
assume the best interpretation, to give the skill the benefit of the doubt.

Resist this. The author always reads charitably. That is why the gaps exist.

The Walt Walk only has value if it reads as the agent will actually execute —
without the author's intent, without their context, without their assumptions.
Walk it honestly, and it will show you what no review from the outside can.
