---
name: three-rooms
description: >
  Walt Disney's Three Rooms method — develop a single idea by passing it through
  three separate mindsets in strict sequence: Dreamer (every way it could go),
  Realist (the practical elements to build it), Critic (what must be resolved to
  make it real). The canonical front door for developing one idea from spark to
  workable concept. Use when you have an idea and want to develop it properly:
  "run this through the three rooms", "develop this idea", "take this idea
  somewhere", "dreamer realist critic", "the Disney method", or /three-rooms.
  This is for developing ONE idea through all three rooms — for generating many
  ideas from a stated problem, use creative-ideas instead; for unconstrained
  brainstorming with no idea yet, use creative-dreamer; for a hard pass/fail risk
  gate before committing resources, use creative-sentinel.
user-invocable: true
---

# Three Rooms

Walt Disney famously used three separate rooms — one to dream, one to plan, one to
critique — and never let the three mindsets mix. An idea that survives all three rooms
comes out developed: imagined fully, made practical, and stripped of what would stop it
working. This skill takes **one idea** and walks it through those three rooms in order.

The discipline is the separation. Each room runs to completion before the next opens. You
do not plan while dreaming. You do not critique while planning. Mixing the rooms is what
kills ideas early — this skill exists to keep them apart.

---

## Constraints

- Develop **one idea** at a time. If several are on the table, pick one or ask which.
- Run each room fully before opening the next. No filtering in Room 1, no critique in Room 2.
- Carry the idea forward intact — each room receives the previous room's full output as context.
- Do not collapse the rooms into a single pass. The value is the strict sequence.

---

## Room 1 — Dreamer

Invoke `/creative-dreamer` via the Skill tool, anchored to the idea. Explore every way the
idea could develop — bold, unfiltered, no feasibility checks. Let it run to completion.
Capture the full space of possibility before moving on.

## Room 2 — Realist

Invoke `/creative-planner` via the Skill tool, passing the idea and the Room 1 output. Turn
the possibilities into practical elements: what it would actually take to build, the
concrete first steps, the resources and dependencies. The realist stays on the idea's side —
figuring out *how* it works, not whether it should.

## Room 3 — Critic

Invoke `/creative-crictic` via the Skill tool, passing the idea and the Room 2 plan. Find
the gaps, weaknesses, and risks that stand between the plan and actually happening — so they
can be resolved while there is still time. The critic makes the idea stronger, not dead.

---

## Output

Present the idea as it emerged from all three rooms:

- **The idea** — one clear sentence
- **Room 1 (Dreamer)** — the directions worth keeping
- **Room 2 (Realist)** — practical elements, first steps, resources
- **Room 3 (Critic)** — what must be resolved to make it real, and how

Close by naming the next move: if the idea needs a hard pass/fail gate before resources are
committed, suggest `/creative-sentinel`; if it needs iterative refinement to a locked spec,
suggest `/creative-process`.

---

## Transitions

- No idea yet, just open exploration: `/creative-dreamer`
- Many ideas from a stated problem: `/creative-ideas`
- Hard risk gate before committing: `/creative-sentinel`
- Iterative refinement to a gate-cleared spec: `/creative-process`
