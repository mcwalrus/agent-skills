---
name: how-to
description: >
  Answer "how would you solve X?" with a speculative exploration of possible
  solutions instead of solving it directly. Enumerate candidate approaches,
  explain them to the user first, then interactively verify the results before
  ever claiming a process. Use when the user asks how you would approach or
  solve a problem and wants the thinking, not the finished artefact. Trigger on
  "how would you", "how do you solve", "how can I approach", "walk me through
  how you'd", "how-to", or /how-to.
user-invocable: true
---

# How-To

Answer the question **"how can you, as an agent, solve this problem?"** — not
the problem itself.

The deliverable is an understanding of the *space of possible solutions* plus a
verified route through it. Do not jump to a final answer, and do not present a
process as authoritative until the user has seen it and its elements have been
checked interactively.

## The rule

| Do | Don't |
|---|---|
| Speculate about possible solutions | Solve the problem directly |
| Explain your thinking to the user first | Hand over a finished artefact |
| Verify interactively, with the user in the loop | Claim a process from reasoning alone |
| Say "this might work because…" | Say "this is how to do it" |

A speculative claim is allowed at any point. A **claimed process** — a
recommended, ordered set of steps — is only allowed after the verification
stage below.

## Stages

### 1. Frame the question

Restate the problem precisely so the exploration cannot drift. Name:

- What is actually being asked (the outcome, not the phrasing)
- What you know vs. what you are assuming
- Constraints that will shape which solutions are viable
- What "solved" means, so verification has a target

Ask the user to correct the framing before going further if anything is
ambiguous.

### 2. Speculate — explore the solution space

Generate several *candidate* solutions before evaluating any of them. Quantity
first; judgement later.

For each candidate, capture:

- **The approach** — one or two sentences, plain English
- **Why it might work** — the mechanism you believe is at play
- **Why it might not** — the failure mode, cost, or unknown
- **What would prove it** — the cheapest observation, probe, or experiment
  that would confirm or kill it

Label every statement by its basis:

- **Known** — evidenced by something you read, ran, or were told
- **Inferred** — reasoning with the gap named
- **Assumed** — stated as an assumption, not a fact

Do not rank the candidates yet. That is a verification output, not a
speculation input.

### 3. Explain first

Present the framed question and the candidate solutions to the user **before
acting on any of them**. This is the hand-off: the user sees the space of
options and the reasoning while it is still cheap to redirect.

State clearly that these are speculative. Invite the user to:

- Add or veto candidates
- Correct assumptions
- Point at the one they care about most

### 4. Interactively verify

Now check the candidates — cheapest probe first, and with the user in the loop:

- **Cheap probes** — read the relevant file, call the API read-only, run the
  smallest possible spike, inspect the dependency or config.
- **Ask the user** — for context only they hold, for a preference between
  routes, or to confirm a finding against their intent.
- **Falsify** — try to break the leading candidate, not confirm it. A candidate
  that survives an honest attempt to kill it is worth more than one that was
  never tested.
- **Record** — what was tested, what was observed, and what remains unverified.

Verification is interactive, meaning it alternates between doing and asking.
Do not batch a dozen silent experiments and present a conclusion; surface
results and questions as they arise.

### 5. Claim the process

Only once the elements have been verified, present the process:

- The recommended route, with each step tied to the evidence that supports it
- The candidates that were ruled out, and why
- What remains unverified or assumed
- Where the process would change if a named assumption breaks

If verification is impossible for some part, say so explicitly and label that
part speculative — never silently promote it to a claim.

## Honesty discipline

- A process derived from reasoning alone is a **hypothesis**, not a how-to.
- "I couldn't verify this" is a valid and required output.
- Never let the user mistake speculation for a verified route — label both
  states every time you use them.

## Anti-patterns

- **Solving it anyway** — producing the artefact the question was about, and
  skipping the exploration.
- **Single-candidate tunnel vision** — settling on the first approach that
  comes to mind and dressing it up as analysis.
- **Explanation after the fact** — doing the work, then presenting a process
  the user never got to shape.
- **Verification theatre** — testing only what confirms the chosen route.
- **Confident hand-off** — delivering a step-by-step process that was never
  checked against reality.
