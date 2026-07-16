---
name: storyboard
description: >
  Map the experience of encountering any exposed software surface — UI, CLI, API,
  protocol, agent tool interface, or any other interaction point — as a sequence
  of panels that makes the user or caller's experience visible and concrete before
  implementation begins. Use to map what a user actually encounters step by step,
  surface experience gaps before writing code, or evaluate whether a proposed design
  serves the person or system encountering it. Trigger on phrases like "storyboard
  this", "map the experience", "what does the user encounter", "walk through the UX",
  "map the flow", "what does the API caller experience", "design the interaction",
  "UX for this CLI", "experience map", "sequence the interaction", or any request to
  make an interaction visible as a sequence before it is built. Also trigger when
  reviewing existing designs to discover experience gaps, or when designing agent
  tool interfaces, API contracts, or CLI flows — not just visual UIs.
---

# Storyboard

A storyboard makes the invisible visible. Before a frame is animated, before a
line of code is written, the storyboard shows what happens — panel by panel,
moment by moment — from the perspective of the person or system encountering the
surface.

This is pre-implementation work. You are not designing the system. You are
designing the *experience of encountering the system* — and doing it while it is
still cheap to change.

---

## Surface Types

This skill covers any exposed software surface. The panels differ by surface
type, but the discipline is the same: trace the encounter from the outside in.

| Surface | The Encountering Party | What Panels Capture |
|---|---|---|
| **UI / Web App** | Human user | Visual state, action, feedback, next state |
| **CLI tool** | Developer / human operator | Command, flags, output, error states |
| **API** | Calling service or agent | Request construction, response handling, error paths |
| **Protocol** | Peer system | Handshake, message sequence, state transitions |
| **Agent tool** | AI agent executor | Tool call, input schema, output, failure modes |
| **Auth / onboarding flow** | New user or service | Gate sequence, credential exchange, first success state |

When the encountering party is an AI agent, apply the instincts of the
**walt-walk skill** to each panel — trace what the agent sees, decides, and
does, not just what the system presents.

---

## Before You Begin — Check References

Common interaction patterns are captured in `./references/`. Before generating a
storyboard from scratch, check whether a relevant pattern already exists.

Current reference patterns:
- See `./references/` for available pattern files

If a reference pattern applies, use it as the foundation and adapt it to the
specific context. Do not rebuild from scratch what has already been captured.

If you generate a storyboard that contains a reusable pattern — one that will
recur across different surfaces or products — **write it back to `./references/`**
at the end of the session. Name the file descriptively: `auth-flow.md`,
`api-error-handling.md`, `cli-onboarding.md`, `agent-tool-call.md`.

---

## Panel Structure

Each panel in the storyboard captures one discrete moment in the encounter. A
moment is defined by a change in state — something the encountering party does,
sees, decides, or receives.

**Panel format:**

```
## Panel [N]: [Moment Title]

**Encountering party state:** What do they know / have / feel at this moment?
**Surface state:** What is the system presenting?
**Action / trigger:** What happens — what does the party do, or what does the system do?
**Output / feedback:** What does the encountering party receive in response?
**Decision point (if any):** Does the party have a choice here? What are the paths?
**Next panel:** Where does each path lead?

**Experience note:** Anything worth flagging about this moment — friction,
  confusion risk, missing feedback, gap between expectation and reality.
```

Not every field is required for every panel. Keep it lean — the goal is
visibility, not bureaucracy.

---

## The Storyboard Discipline

**Stay outside the implementation.** You are not designing the database schema,
the API architecture, or the component tree. You are designing what is
*encountered*. When implementation details creep in, name them and set them
aside: *"Implementation detail — not in scope for this storyboard."*

**Follow the unhappy paths.** The happy path is always obvious. The storyboard
earns its value by tracing what happens when something goes wrong — wrong input,
unexpected state, timeout, permission denied, ambiguous response. These are the
moments that reveal whether the design actually serves the encountering party or
just assumes success.

**Name the assumptions.** When you don't know what the surface will show at a
moment, name the assumption explicitly in the panel. *"Assuming the system
confirms submission immediately — if there is a delay, Panel 4 needs a loading
state."* This surfaces design decisions before implementation locks them in.

**Use the creative-dreamer instinct for new designs.** When storyboarding a new
surface, run the dreamer's discipline first: what would the ideal encounter look
like if the encountering party's experience were the only constraint? Generate
the best possible panel sequence before narrowing to what is feasible.

**Use the creative-critic instinct for review.** When storyboarding an existing
design, run the critic's discipline: where does the encounter break down? Where
is the gap between what the design assumes the party knows and what they
actually know? Where does the system disappear at the moment the party needs it?

---

## Storyboard Output Format

### Header
```
# Storyboard: [Surface Name]
Surface type: [UI / CLI / API / Protocol / Agent Tool / Auth Flow / Other]
Encountering party: [Human user / Developer / AI agent / Peer system / ...]
Scope: [What interaction is being mapped — start state to end state]
Reference patterns used: [list any ./references/ files applied]
```

### Panel Sequence
Number panels sequentially. Where paths diverge, branch the numbering:
Panel 3 → Panel 3a (happy path) / Panel 3b (error path).

### Experience Summary
After all panels: a short assessment of the overall encounter quality.
- Where is the experience strongest?
- Where are the critical friction points or gaps?
- What design decisions does this storyboard reveal that need to be made
  before implementation?

### Open Questions
Things the storyboard could not resolve — decisions the storyboard has surfaced
that need an answer before the design can be finalised.

### Reference Contribution
If a reusable pattern was generated: name it and note that it has been written
(or should be written) to `./references/[pattern-name].md`.

---

## Writing Back to References

When a storyboard produces a pattern that is general enough to recur, capture it
in `./references/` using this format:

```markdown
# Pattern: [Pattern Name]
Applies to: [surface type(s)]
Encountering party: [who this pattern is for]
When to use: [the context in which this pattern applies]

## Pattern Summary
[One paragraph describing the interaction pattern and why it works]

## Panel Template
[Reusable panel sequence — with variables marked as [VARIABLE_NAME]]

## Variants
[Common variations on the pattern and when to apply each]

## Experience Notes
[Known friction points, design decisions, and what to watch for]
```

Patterns in `./references/` are living documents. If a storyboard session
reveals that an existing pattern needs updating, update it.
