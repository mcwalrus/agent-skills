---
name: spell-it-out
description: >
  Produce an explicit, reviewable chain of reasoning events for understanding how a problem was identified or solved. Use when the user wants to see the thinking, audit how a conclusion was reached, or generate reviewable context — either prospectively while engaging with the problem or retrospectively after the fact. Trigger on "spell it out", "show your working", "show your reasoning", "walk me through your thinking", "trace your logic", "show me how you got there", or /spell-it-out. Do NOT trigger for root cause analysis on a specific failure — use 5whys for that. Do NOT trigger for stripping a problem to bedrock truths and rebuilding — use first-principles for that. Do NOT trigger for adversarial critique of a finished artefact — use critical-reviewer for that. Do NOT trigger for developing one idea through three mindsets — use three-rooms for that.
user-invocable: true
---

# Spell It Out

Produce an explicit chain of reasoning events so the path from inputs to conclusion is auditable. The chain is the assessment — not the conclusion itself. Each step is one logical move, grounded in a prior step, a stated fact, or a flagged assumption. A reader should be able to follow the chain, challenge any link, and see exactly which links would have to give for the conclusion to give.

The skill works in two modes and the output shape is the same in both:

- **Live** — engaging with a problem as it is being worked out. The chain is built as the reasoning happens.
- **Retrospective** — after the fact. The chain is reconstructed from what was decided and done, including the dead ends that were rejected.

The aim in both modes is the same: reviewable context for how the problem was understood and resolved.

## Values

- **Trace over conclusion.** The path matters as much as the destination. A correct conclusion reached by an invisible chain is a worse outcome than a slightly less optimal conclusion reached visibly. The chain is the deliverable.
- **One move per step.** Each reasoning event holds exactly one logical operation — observation, inference, deduction, comparison, hypothesis, ruling-out, or reframe. Bundling moves is how chains become opaque.
- **Visible dependency.** Every step declares what it rests on: a prior step number, a stated fact, or a flagged assumption. If the dependency is not named, the step is unanchored.
- **Honest gaps.** Where the reasoning jumps, say so. Where the chain could have forked, name the branch and what would have changed. Where a fact is assumed rather than verified, mark it. A clean-looking chain built on hidden leaps is worse than a chain that openly admits its gaps.

## Constraints

- Never collapse two reasoning events into a single step for brevity. Compression defeats the purpose.
- Never state a step whose dependency is unclear. If a step's basis cannot be named, mark the step as **ungrounded** rather than smoothing over the gap.
- Never hide assumptions inside claims. Assumptions get their own line and are flagged as such — distinct from facts.
- Never produce a chain that arrives at a conclusion the chain does not actually support. If the conclusion outruns the chain, say so and mark the conclusion as provisional.
- Never fabricate a step retroactively to make the chain look cleaner. Retrospective chains include the false starts, not just the path that worked.
- Never use the chain to win an argument. The chain is for understanding, not persuasion.

## Workflow

1. **Frame the question.** State, in one line, what is being understood or decided. Sharpen it until a reader could tell whether the chain has answered it.
2. **Inventory the inputs.** Separate *facts* (verifiable, named, with basis) from *assumptions* (taken for granted, flagged as such). The chain cannot rest on inputs that aren't visible.
3. **Build the chain.** For each reasoning event, write:
   - the *claim* — what is now believed or concluded at this step,
   - the *basis* — what grounds it: a prior step number, a stated fact, or a named assumption,
   - and the *operation* — the kind of move: observation, inference, deduction, comparison, hypothesis, ruling-out, reframe, etc.
4. **Mark branch points.** Where the chain could have gone a different way, name the branch, what supported it, and what would have changed in the conclusion. Retrospective chains should also include branches that *were* taken and later abandoned.
5. **State the conclusion.** What does the chain support, in one or two sentences. Then name the load-bearing steps — the ones whose removal would collapse the conclusion. If any load-bearing step is ungrounded, the conclusion is provisional.

## Output Format

A reasoning trace with these sections, in order. Each step in the chain has a fixed shape. Scale the number of steps to the problem; do not pad.

### Question

The thing being worked out. One line, sharpened until it is unambiguous. A vague question produces a vague chain.

### Inputs

**Facts** — verifiable statements the chain rests on. For each: what it is, and how it is known.

**Assumptions** — taken-for-granted premises the chain rests on. Each is flagged as an assumption so a reader can choose to challenge it.

### Chain

A numbered list. For each step:

```
[N]. **Claim:** [what is now believed or concluded at this step]
    **Basis:** [prior step number | stated fact | named assumption]
    **Operation:** [observation | inference | deduction | comparison | hypothesis | ruling-out | reframe | …]
```

A step's basis must trace to a named anchor. If no anchor exists, mark the step **ungrounded** rather than fabricating one. Steps are numbered so dependencies can refer back by number.

### Branches

Where the chain could have forked (live mode) or did fork and was abandoned (retrospective mode). For each:

- **At step N**, the chain could have gone *alternative direction* because *what would have supported it*. If taken, the conclusion would have become *different outcome*.

### Conclusion

What the chain supports, in one or two sentences. Then list the **load-bearing steps** — the numbered steps whose removal would collapse the conclusion. If any load-bearing step is marked ungrounded, the conclusion is provisional and that fact is stated here, not buried.

## Transitions

- Once the assessment (the chain) is produced, invoke `/skill:plain-english` to render the trace for the reader. The chain's structure stays intact; the wording becomes accessible. Load the plain-english skill only after the assessment is complete, so the chain is not simplified mid-construction.
- For root cause analysis on a specific failure, use `/5whys` instead — it converges on a single actionable cause, whereas this skill traces reasoning without forcing convergence.
- For stripping a problem to bedrock truths and rebuilding from them, use `/first-principles` instead — it tests the *truth value* of premises, whereas this skill exposes the *logical path* from premises to conclusion.
- For adversarial critique of a finished artefact, use `/critical-reviewer` instead — it attacks a draft, whereas this skill exposes a chain.
- For developing a single idea through three mindsets in sequence, use `/three-rooms` instead — it separates dreaming, planning, and critique, whereas this skill produces a single auditable trace.
