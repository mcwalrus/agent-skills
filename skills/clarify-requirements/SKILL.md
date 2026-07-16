---
name: clarify-requirements
description: >
  Uncover a user's hidden and ambiguous requirements by asking only the
  targeted clarifying questions needed to understand how they want a problem
  solved, then confirm that understanding before any solving begins. Trigger
  when a problem arrives with fuzzy or unstated rationale and you must
  understand intent before acting — phrases like "clarify the requirements",
  "ask me what you need to know", "I'm not sure what I actually want", "help me
  figure out what I'm asking for", "what do you need from me to solve this",
  "the reasoning here is fuzzy", or /clarify-requirements. Do NOT trigger when
  the request is actionable as stated and a wrong guess is cheap to correct —
  just attempt it and iterate. Do NOT trigger when the requirements are already
  clear and the task is to structure, plan, or build them — this skill resolves
  ambiguity, it does not plan or execute.
user-invocable: true
---

# Clarify Requirements

When a problem arrives with fuzzy, incomplete, or unstated rationale, uncover
what the user actually needs before any solving begins. Ask the minimum set of
targeted questions required to surface both **hidden** requirements (implied
but never stated) and **ambiguous** ones (stated but open to multiple
readings), then confirm that understanding with the user. Success is the user
agreeing "yes, that's what I meant" — reached with the fewest questions, not
the most.

## Values

- **Minimum necessary inquiry.** Infer everything context allows; ask only the
  genuine gaps. Many questions are a failure mode, not thoroughness.
- **Every question must change the answer.** If knowing wouldn't alter the
  solution, don't ask it.
- **Hidden over obvious.** The valuable questions surface unstated assumptions
  and constraints — not restatements of what's already given.
- **Confirm, don't assume.** An understanding the user never saw is an
  assumption, not a requirement. Surface your reading so it can be corrected.

## Constraints

- Never invent or commit to requirements the user hasn't expressed or confirmed.
- Never treat your understanding as settled until you have surfaced it and the
  user has confirmed or corrected it.
- Never proceed to solve, plan, or build the problem — this skill ends once the
  requirements are confirmed.
- Never ask a question whose answer is already determinable from context;
  resolve it by inference and state the inference instead.
- Never ask serially when questions can be batched — group related questions
  into a single AskUserQuestion call.
- Stop asking once remaining unknowns would not materially change the solution.
  Do not pad to a quota.

## Workflow

1. **Restate the problem.** In one or two sentences, including the rationale as
   you currently understand it. Making your reading explicit lets a wrong
   reading get caught early.
2. **Map the unknowns.** List what you'd need to know to solve it well. Separate
   *hidden* requirements (implied, unstated) from *ambiguous* ones (stated,
   multiple readings). Discard any you can answer from context — note the
   inference instead.
3. **Rank by leverage.** Order the remaining unknowns by how much the answer
   changes the solution. Drop the low-leverage ones.
4. **Ask in batches.** Batch related high-leverage questions into a single
   AskUserQuestion call rather than asking serially (the tool caps the batch —
   respect its limit). Offer concrete, mutually exclusive options where
   possible; the tool's "Other" escape covers the rest. Iterate only if an
   answer opens a genuinely new, high-leverage unknown.
5. **Confirm the understanding.** Surface your assembled understanding of the
   requirements back to the user and let them correct it. Match the weight to
   the problem — a sentence for a small ambiguity, a structured summary for a
   large one. If the user declines to answer a question, proceed on your best
   inference, state that you are inferring, and flag it as open. Stop once the
   user confirms.

## Output

The primary output is a **confirmed understanding** of the requirements held in
the working context — not a mandatory document. Always surface that
understanding for confirmation (Workflow step 5); only formalise it into a
written artifact when the user asks, or offer one proactively when the
uncovered requirement set is large enough that an ephemeral understanding would
be a real loss.

When a written brief is produced, structure it as:

- **Problem** — the problem and its rationale, in the user's confirmed framing.
- **Requirements** — each uncovered requirement, marked stated, inferred, or
  confirmed.
- **Constraints** — boundaries, non-negotiables, things to avoid.
- **Success criteria** — what a good solution looks like.
- **Open questions** — anything deliberately left unresolved, and why.

## Handoff

This skill ends at confirmed requirements. Once they are clear, hand them back
to the user, or pass them forward to whatever structures, plans, or executes
the work — that next step is out of scope here.
