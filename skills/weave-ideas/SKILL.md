---
name: weave-ideas
description: >
  Weave a concept into an existing project — survey the project landscape for
  supporting and opposing ideas, run a comparative review, then place the idea
  as a concrete project artifact. Use when: "weave this idea into the project",
  "I have an idea that should shape this project", "integrate this concept into
  the roadmap", "plant this idea with its trade-offs considered", "embed this
  concept", "/idea-weave". The idea arrives with or without justification; this
  skill constructs the framing, surfaces tensions, and places it. Do NOT trigger
  for generating novel ideas from a problem — use idea-forge for that. Do NOT
  trigger for designing technical component wiring between services — use
  project-weave for that. Do NOT trigger for auditing and removing stale
  assumptions — use heresy-hunt for that.
user-invocable: true
---

# Idea Weave

Take a concept — with or without justification — survey the forces that support
and oppose it within the project, and embed it constructively as a concrete
project artifact. Success is an idea that has been examined from multiple angles,
framed in light of real tensions, and placed where it can act.

The creative family's posture is the reference point: structured like
creative-planner, critical like creative-crictic, gated like creative-sentinel.
An idea that hasn't been reviewed hasn't been woven — it's been dropped.

## Values

- **Incremental over heroic.** Prefer ideas that improve the project in small,
  durable steps over ideas that require transformation before delivering value.
- **Constraints as advantages.** When the project has constraints (time, scope,
  tech debt, team size), reframe them — a constraint is often a forcing function
  that produces better design.
- **Right idea, right stage.** Assess where the project is now. An idea that
  would be powerful later may be harmful today.
- **Consistency compounds.** The best idea, applied inconsistently, produces
  worse outcomes than a good-enough idea applied with discipline.

## Constraints

- Never place an idea without completing Phase 2 (landscape survey) and Phase 3
  (comparative review). An unreviewed idea is not a woven idea — it's been dropped.
- Never flatten tensions. Surface them explicitly in the output, even when they
  complicate or challenge the idea being placed.
- Frame all output constructively — the goal is project improvement, not idea
  advocacy. If the idea does not serve the project, say so plainly.
- Do not place an idea that cannot be stated as a concrete improvement. Abstract
  concepts that resist concreteness are not ready to be woven.

## Workflow

### Phase 1 — Receive and Clarify

Read the idea and any justification provided.

1. State the idea plainly in one sentence. Strip justification language — what
   is the actual concept?
2. State what it improves. What is currently worse without this idea?
3. Assess readiness: does this idea have a concrete form? If fully abstract,
   ask the user to ground it before proceeding.

Present your restatement and confirm before Phase 2.

### Phase 2 — Landscape Survey

Read the project's active ideas and directions before comparing.

1. Run `bd list` to read active beads issues — identify themes, stated
   directions, and in-progress work.
2. Run `brief digest` (if brief is available) to read active futures and specs.
3. Read the project's `CLAUDE.md` for stated values, priorities, and constraints.
4. Identify from the survey:
   - **Aligned ideas** — existing work or directions that amplify or support
     this idea
   - **Opposing ideas** — existing work or directions that conflict or create
     tension with this idea
   - **Adjacent ideas** — related but not directly aligned or opposed
5. If the survey surfaces an idea effectively identical to the one being woven,
   surface it as a tension in Phase 3: "This idea may already exist as
   [reference]." Do not create a duplicate artifact.

If neither `bd` nor `brief` is available, read what is available (git history,
CLAUDE.md, open files) and note the gap explicitly.

### Phase 3 — Comparative Review

Present the landscape before placement:

```
Idea: [restated plainly]
Improves: [what is currently worse without it]

Aligned: [supporting ideas/directions, with a brief note on how they align]
Opposing: [tensions, stated plainly — do not soften]
Adjacent: [related ideas worth noting]

Stage check: [is the project at the right stage for this idea? Reason from
             current priorities and the right-idea-right-stage value]
```

If opposing ideas are present, present them without resolution. The user
decides whether to proceed, adapt, or defer. Do not skip to placement without
the user reading the tensions.

### Phase 4 — Constructive Framing

Frame the idea in light of the comparative review:

1. Apply the values: would this be incremental? Does it reframe a constraint?
   Is it consistent with existing direction? Does it require consistency to land?
2. If opposing ideas were surfaced, name explicitly how the idea would co-exist
   with them — or state that it cannot.
3. Write a constructive framing statement: what this idea does for the project,
   why it belongs here, and at what stage it should take root.

If Phase 4 concludes the idea is net-negative — it creates more problems than
it solves, or conflicts irreconcilably with all existing directions — state this
plainly and terminate. Do not proceed to Phase 5. The output is the framing
statement explaining why the idea should not be woven.

### Phase 5 — Placement

Choose the artifact form based on the idea's concreteness:

| Idea state | Artifact |
|---|---|
| Actionable — discrete tasks can be written now | Beads issue via `bd create` |
| Directional — shapes future decisions, not current tasks | Brief future via `/brief` |
| Both | Brief future + beads issue, linked in the brief |

Use "Both" when the idea has immediate actionable work AND establishes a
direction that should remain visible across future sessions.

Include in the artifact:
- The constructive framing statement (Phase 4)
- The opposing ideas and tensions (verbatim from Phase 3 — do not soften)
- The stage check verdict

Present the artifact preview to the user before writing. Write only on confirmation.

## Output Format

- **Phase 3** — comparative review block (structured as the template above)
- **Phase 5** — artifact preview, then file path after writing

## Transitions

If the idea generates significant opposition and the user wants to develop a
response or alternative, hand off to `/creative-process` with the comparative
review as the starting brief. If new ideas need to be generated before placement,
invoke `/idea-forge` first. If the project's landscape is too cluttered with
stale ideas to get a clear read, run `/heresy-hunt` to clear the field before
re-running this skill.
