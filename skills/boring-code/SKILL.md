---
name: boring-code
description: >
  Write code the boring way — the most obvious implementation that solves the
  real problem today, readable by a stranger in 30 seconds. Trigger on "write
  boring code", "keep it boring", "write obvious code", "the boring way", "plain
  code", "straightforward code", or /boring-code. Do NOT trigger for decision
  coaching on whether to go simple — use dumb-approach for that. Do NOT
  trigger for reviewing existing code — use simplify for that.
user-invocable: true
---

# Boring Code

Write the most obvious code that solves the real problem *today*. Not the
problem you might have in six months. Not the elegant abstraction that would
handle every case. The thing that works, that a stranger can read cold and
understand in 30 seconds. Success is boring, readable, correct code that ships.

## Values

- **Working over elegant** — a solution that ships beats one that impresses
- **Obvious over clever** — a reader encountering the code cold should
  understand it immediately
- **Deferred complexity** — earn sophistication by hitting a real limit,
  not by anticipating one

## Constraints

- Never remove tests, error handling at system boundaries, or correctness
  checks in the name of simplicity
- Never mask a genuine safety or security tension with simplicity — name it
  explicitly instead
- Never copy-paste identical blocks more than twice before extracting; that
  is the point at which duplication costs more than abstraction

## Workflow

1. **State the actual requirement** — Ask "what does this need to do right now?"
   Strip hypothetical future requirements, defensive abstractions, and edge
   cases that have not materialized.

2. **Write the obvious version** — Use the simplest data structures, the most
   direct control flow, the first implementation that comes to mind. If the
   code is not immediately readable to someone who has never seen it, it is
   not obvious enough.

3. **Add safety at boundaries** — Add error handling at system boundaries,
   tests for non-obvious logic, and correctness checks. Boring code is not
   lazy code.

4. **Evaluate for obvious wins** — If a language feature (not a library or
   framework) makes the code more readable, use it. If a small refactor
   (renaming, extracting a one-liner) reduces cognitive load without adding
   abstraction, do it.

5. **Name explicit tensions** — If simplicity genuinely conflicts with safety,
   performance, or correctness, state the tension and the smallest
   compromise that resolves it. Never hand-wave.

6. **Defer, do not delete** — Note what was left out (edge cases,
   generalization, optimization) and what real-world signal would
   justify adding it. The deferred list survives in comments or a TODO.

## Output Format

Respond with:

- **The boring path**: the actual implementation, written plainly
- **What was deferred**: what complexity is postponed (edge cases,
  generalization, optimization)
- **Revisit signal**: what real-world event would justify adding complexity
- **Tensions named**: any place where simplicity and safety/performance
  genuinely conflict and the resolution chosen

## Transitions

If the user is unsure whether to go simple or complex, invoke `dumb-approach`
instead.

If the user wants to review existing code for quality or efficiency, invoke
`simplify`.
