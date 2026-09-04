---
name: manual-action-list
description: >
  Identify manual processes the user must perform themselves and produce a
  structured action list, integrating any additional steps they have already
  taken and flagging external systems the agent cannot natively interact with.
  Trigger on "what do I need to do manually", "prepare an action list",
  "identify manual processes", or any task involving steps performed outside
  the AI harness. Do NOT trigger for general task decomposition — use
  task-preparation. Do NOT trigger for delegating work to sub-agents — use
  prepare-fan-out.
---

# Manual Action List

Surface the manual work only the user can do. The agent helps structure and
integrate; the user performs the actions.

## Constraints

- Never assume the agent can interact with external systems the user
  mentioned (CMS platforms, payment gateways, vendor portals, etc.). The
  agent has no native tools for these — they are the user's domain.
- Never fabricate authoritative references. If the harness cannot search the
  web, say so and ask the user to supply sources or enable web search.

## Workflow

1. **Collect context.** Read what the user has described, including any
   additional steps they have already taken. Add these to the action list
   verbatim under an _Already completed_ section so they are not lost.
2. **Split the work.** For each remaining step, classify it as:
   - _Agent can do_ — within the harness (code, files, commands, scripts).
   - _User must do_ — requires access to a system, account, or judgement the
     agent does not have.
   - _External system_ — must be performed inside a third-party platform
     (e.g. building pages in a CMS, configuring a vendor dashboard). The
     agent can describe the step but cannot execute it.
3. **Reference where appropriate.** When a step has a well-known correct
   approach (vendor docs, official guides), cite it. **Before citing, check
   whether the harness has web search available.** If it does not, tell the
   user explicitly: state which sources are needed and ask them to paste
   the relevant docs or enable web search on the harness. Do not invent URLs.
4. **Produce the action list.** Use the format below.

## Output Format

```
## Already completed
- [user's steps, preserved verbatim or lightly grouped]

## Agent will do
- [step] — [why this is in the agent's scope]

## User must do (external systems)
- [step] — [which system, why the agent cannot do it]

## Reference needed
- [topic] — [what authoritative source is required, and whether the harness
  can fetch it. If not, ask the user to provide it.]
```

## Transitions

- To `task-preparation` — when the broader task needs scoping before action
  items make sense.
- To `prepare-fan-out` — when the agent-doable steps are large enough to
  warrant parallel sub-agents.