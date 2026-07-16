---
name: heresy-hunt
description: >
  Surface and remove accumulated ideas, assumptions, or conventions that have lost
  relevance, stopped being true, or are silently degrading quality. A heresy is a
  once-valid belief that time or new evidence has made wrong or counterproductive.
  Use when the user says "find heresies", "audit for stale ideas", "root out bad
  assumptions", "challenge our beliefs about X", "what ideas here don't hold up
  anymore", or invokes /heresy-hunt. Works on documents, plans, skill files,
  codebases, or any body of accumulated thought.
  Do NOT trigger for stress-testing a current plan — use creative-crictic for that.
  Do NOT trigger for future-predictive regret reviews — use future-max for that.
  Do NOT trigger for live idea generation — use creative-ideas for that.
  Do NOT trigger for spec drift between document versions — use spec-drift-review for that.
  Do NOT trigger for trust calibration of agent instructions — use skill-trust-audit for that.
user-invocable: true
---

# Heresy Hunt

Surface and challenge accumulated ideas, assumptions, or conventions that have lost
relevance, stopped being true, or are actively degrading the quality of thinking,
plans, or execution. A heresy is not a mistake — it is a once-valid belief that time,
circumstance, or new evidence has made wrong, irrelevant, or counterproductive. Success
looks like a specific, honest list of ideas worth removing or challenging, with rationale
grounded in what has actually changed.

## Values

- **Specificity over completeness.** One real heresy with a clear reason beats ten vague
  suspicions. Never pad the list.
- **Change as the anchor.** Every heresy has a backstory: something changed that made the
  idea wrong. Find the change — it is what makes the critique credible.
- **Respect the origin.** Ideas become heresies because they were once right. Acknowledge
  what made each idea reasonable when it was formed before explaining why it no longer holds.

## Constraints

- Never flag an idea as a heresy unless you can state what specifically changed to make it
  wrong. If you cannot identify the change, classify as Uncertain — not Heresy.
- Never recommend removing an idea simply because it is old or unpopular.
- Never flag active, load-bearing assumptions as heresies unless you have evidence they are
  no longer load-bearing.
- Do not generate new ideas or replacements — identify what should go, not what should arrive.
- Distinguish cited change from inferred change. Cited: the user stated it, or it is visible
  in the artefact. Inferred: you are reasoning from context. Mark all inferred-change findings
  as requiring user verification before acting on the recommendation.

## Workflow

1. **Receive and scope the artefact.** Accept the document, plan, skill, codebase, belief
   set, or conversation the user wants audited. If no artefact is provided, ask for one.
   If the artefact is large (a codebase, a multi-file collection, a broad topic area),
   negotiate scope before proceeding — confirm which files, sections, or belief areas to
   focus on. Do not silently truncate the audit.

2. **Extract all claims.** Read the artefact and list every idea, assumption, convention,
   or belief embedded in it — not just explicit ones. Surface implicit premises.

3. **Apply the heresy test to each claim:**
   - Is this still true, or has something changed?
   - Is this still relevant to the current context or goal?
   - Is this causing downstream harm — wrong decisions, blocked thinking, wasted effort?
   - Is this held because it is still right, or because it was never questioned?

4. **Classify each claim:**
   - **Active** — still load-bearing and valid. Do not flag.
   - **Stale** — was once relevant, but the context has changed. Flag for review.
   - **Heresy** — actively wrong or counterproductive. Recommend removal or challenge.
   - **Uncertain** — insufficient information to classify, or no identifiable change can be
     named. Flag for the user to verify; state the specific question the user must answer
     to resolve the uncertainty.

5. **Draft the output** for each Stale or Heresy finding: state the idea, what changed
   (cited or inferred), and the consequence of retaining it.

## Output Format

For each finding:

```
**[Heresy | Stale | Uncertain]** "[The idea, quoted or paraphrased accurately]"
**What changed:** [One or two sentences — label as (cited) or (inferred)]
**Consequence of keeping it:** [What happens if this is not removed or challenged]
**Recommendation:** Remove / Challenge / Monitor / Verify: [specific question to answer]
```

Anchoring example of a well-formed heresy entry:

> **[Heresy]** "We should batch all writes to avoid database contention."
> **What changed:** The service moved to a write-ahead log architecture in Q3 (cited —
> visible in the architecture doc). Batching now introduces latency with no contention benefit.
> **Consequence of keeping it:** Engineers continue batching writes, adding 200ms median
> latency for no gain.
> **Recommendation:** Remove

End with a summary line: `X heresies found, Y stale ideas flagged, Z uncertain.`

If the artefact is clean, say so directly. Do not manufacture findings to justify the audit.

## Transitions

- For generating replacement ideas after heresies are cleared, invoke `/creative-ideas`.
- For stress-testing whether a current plan is viable, invoke `/creative-crictic`.
- For auditing skill instruction sets for trust calibration, invoke `/skill-trust-audit`.
- For detecting drift between document versions, invoke `/spec-drift-review`.
