---
name: simple-plan
description: Summarise a plan into its key objective changes with plain English, a before/after Mermaid diagram, and an explicit "why" per change. Trigger on "summarise this plan", "simple plan", or /simple-plan.
---

Create a summary of a plan which outlines key objective changes.

I want you to use:

* `/skill:plain-english` to explain the plan.
* `/skill:mermaid-diagrams` to show the transition state before and after.
* `/skill:spell-it-out` and explain *why* we are wanting to make changes stated from the plan.

When anything is unclear, or when questions need to be addressed, ask the user for clarity.

If multiple large changes are stated, refactor these into separate plans.

Try keep to keep this under 600 words, at most.
