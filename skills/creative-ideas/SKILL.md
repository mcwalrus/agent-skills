---
name: creative-ideas
description: >
  Generate novel ideas with genuine creative merit from stated problems — problem-anchored,
  not open-ended. Invokes creative-dreamer for unfiltered raw ideation, then creative-planner
  to develop ideas that hold merit: whether immediately actionable or potentially transformative
  for how a process or methodology works. Use when problems have been found and you need ideas
  worth pursuing: "generate ideas for this problem", "what could we do about X", "creative
  approaches to this specific issue", or /creative-ideas. Also use after problem discovery
  sessions to generate creative responses to found problems. Do NOT trigger for open-ended
  brainstorming without a problem anchor — use creative-dreamer. Do NOT trigger when structured
  novelty techniques are the primary goal — use idea-forge. Do NOT trigger when gate-clearing
  an existing plan — use creative-process. Do NOT trigger when planning a single chosen idea
  — use creative-planner.
user-invocable: true
---

# Creative Ideas

Take stated problems and generate novel ideas with genuine creative merit — ideas worth
pursuing because they are non-obvious, not merely because they are immediately executable.
This skill bridges problem discovery and creative response: creative-dreamer generates
the raw space of possibility, creative-planner shapes the most promising ideas toward
something real. Some ideas earn their place by being immediately actionable. Others earn
it by being potentially transformative — reshaping how a process, methodology, or system
works entirely. Both are valid. What is not valid is the obvious idea dressed as a novel one.

---

## Values

**Creative merit over immediate practicality.** An idea that is revolutionary — that could
change *how* something works, not just *what* is done — deserves development even if it is
not immediately executable. The most valuable ideas often require a leap before the path
becomes visible. Evaluate on whether the idea holds genuine merit, not whether it is safe
to act on today.

**Novelty is the filter.** The obvious idea was already on the table before this skill ran.
Reject it. The value here is in finding what wasn't already there.

**Breadth before depth.** Run the dreamer pass fully before selecting anything. Premature
filtering kills the most interesting ideas first.

**Focused selection.** Select a small, focused set — typically 2–3 ideas — before planning.
Depth requires focus; resist expanding the selection. Adapt when the user explicitly asks
for more or fewer.

---

## Constraints

- Do not filter or evaluate during the dreamer pass. All ideas are valid until Phase 3.
- Do not use "immediately actionable" as the only criterion for merit. An idea can hold merit
  by being potentially transformative even if the path to execution is not yet clear.
- Do not generate ideas against an unclearly stated problem. Confirm the problem in Phase 1.

---

## Phase 1 — Problem Intake

Understand the problem fully — what is broken, what constraints exist, what has already
been tried. Read what is already provided; do not re-ask for information already given,
and ask only about what is genuinely missing. Confirm your understanding with the user
before proceeding.

If multiple problems are present, group related ones. Ideation across grouped problems
often surfaces ideas that address several at once.

---

## Phase 2 — Dreamer Pass

Invoke `/creative-dreamer` via the Skill tool, anchored to the confirmed problem(s). Pass
the problem statement as context. Let dreamer run fully without filtering.

Pass all problem groups to dreamer together as a single anchored context — dreamer surfaces
ideas that cut across groups. Only run separate passes if the problems are entirely unrelated
domains.

---

## Phase 3 — Idea Selection

Review the dreamer output. Select 2–3 ideas satisfying both:

- **Novel**: not the obvious, default, or expected response to the problem
- **Holds merit**: either immediately actionable given the stated constraints, or potentially
  transformative — an idea that could change how the problem domain itself works, not just
  address the surface symptom

For example: "speed up the approval workflow by 10%" is actionable but obvious — it
addresses the symptom. "Replace sequential approval chains with simultaneous threshold
voting" is novel and potentially transformative — it changes how the process works, not
just how fast it runs.

Highlight ideas that are surprising or non-obvious — they are the most likely to be
overlooked and often the most valuable.

Present the selected ideas to the user with a one-line note on why each holds merit. If the
user wants to adjust the selection, honour that before continuing.

---

## Phase 4 — Planner Pass

Invoke `/creative-planner` via the Skill tool for each selected idea, passing the idea and
problem context. From the planner's output, extract:

- What this idea is in one clear sentence
- The first concrete steps toward making it real (or testing its core claim, for
  transformative ideas)
- Critical resources or dependencies

---

## Phase 5 — Output

Compile the extracted output into a structured presentation. For each idea: state what it
is, why it holds merit, the first concrete steps, and resources needed. Present ideas as a
parallel set — no ranking. Close with:

> "These are starting points and directions — not full plans. To develop any into a
> gate-cleared spec, invoke `/creative-process` with the idea as input."

---

## Transitions

If the problem first requires research, diagnostic work, or systems analysis before
ideation is productive, say so — name the more appropriate skill and suggest loading it
first.

- Develop a selected idea into a gate-cleared spec: invoke `/creative-process`
- Explore structured novelty techniques for a specific problem: invoke `/idea-forge`
- Return to unconstrained ideation without a problem anchor: invoke `/creative-dreamer`
- Plan a single chosen idea fully: invoke `/creative-planner`
