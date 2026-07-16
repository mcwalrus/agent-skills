---
name: weave-projects
description: >
  Design orchestration briefs for multi-component project systems —
  microservices, API pipelines, CI/CD workflows, build systems, multi-agent
  architectures, or any system where software components call other components.
  Produces a wiring plan, interface contracts, and an orchestration brief ready
  for implementation planning or architecture review. Use when: "wire these
  services together", "design the pipeline for X", "define the interface between
  A and B", "design a GitHub Actions workflow that calls X then Y", "orchestrate
  these agents", "design the handoffs between these components", "design the
  integration layer". Do NOT trigger for Claude skill orchestration (components
  are Claude skills loaded via the Skill tool) — use skill-weave for that.
user-invocable: true
---

# Project Weave

Design orchestration briefs for multi-component project systems — defining
interface contracts, wiring plans, and integration structures for any
architecture where software components call other components. Success is a
wiring plan, a contract specification for each handoff, and an orchestration
brief ready to hand to an implementation planning session or architecture review.

Cross-pollination is a first-class goal: when a proven orchestration pattern
already exists in the project or a related system, surface it and adapt it
rather than inventing from scratch.

## Values

- **Contracts before code.** Interface expectations must be defined before any
  implementation plan is written. Silent mismatches between caller expectations
  and called component output are the primary failure mode in distributed systems.
- **Proven patterns first.** Survey existing orchestration in the project before
  designing a new wiring structure. Reuse what works.
- **Minimum viable wiring.** Prefer the simplest integration that satisfies the
  outcome. Not every orchestration needs a message bus.
- **One responsibility per component.** Components gain scope as they mature. When a called component has grown two responsibilities that serve different consumers and never co-occur, flag it as a decomposition candidate. Two operations within a single coherent workflow are not a decomposition signal.

## Constraints

- Never design a wiring plan without first reading the spec of each component
  being called — API docs, function signatures, service contracts, README files,
  OpenAPI specs, workflow configs, whatever is available. If a component has no
  readable spec, note it as a gap, design the contract as-if the spec will exist,
  and flag the gap prominently in the brief.
- Never assume what a called component produces — read its output specification
  before defining any contract.
- The orchestration brief is the terminal deliverable. Present it directly to the
  user. There is no universal equivalent to skill-forge for project contexts — if
  the project has downstream authoring or scaffolding tooling, the user should
  connect this brief to it.

## On Multi-Agent Architectures

If the components being orchestrated are Claude agents or skills loaded via the
Skill tool, this skill and `/skill-weave` cover adjacent territory. Use
`project-weave` when the orchestration concern is system-level (data flow, error
handling, deployment sequencing). Use `/skill-weave` when the concern is skill
composition (how Claude skills call and pass context to each other). For systems
that are both — Claude agents embedded in a project pipeline — either skill
applies; use the one that matches the dominant design question.

## Workflow

### Step 1 — Understand the desired orchestration

Clarify what the orchestrating component must achieve and which components it
will call, in what sequence, under what conditions. Read the spec of each
candidate called component before continuing. If a component has no readable
spec, note the gap and continue — design the interface contract as-if the spec
will exist, and flag it clearly in the brief.

As you read each component's spec, classify it before applying the maturity check:

- **Pure** — single declared responsibility, no sub-component orchestration
- **Composed** — itself a pipeline or service mesh coordinating other components

Then apply the maturity check appropriate to its type:

- **Pure component:** Can you write two clean, one-sentence descriptions for genuinely different responsibilities — responsibilities that different consumers depend on, never together? If yes, note it as a decomposition candidate.
- **Composed component:** Do its two pipelines serve entirely different consumers, such that no consumer ever needs both? If yes, note it as a decomposition candidate. A composed component coordinating multiple steps toward one outcome is not a decomposition signal.

A decomposition candidate is a design observation, not a defect. Surface it; don't act on it mid-session.

### Step 2 — Survey orchestration patterns

Search the project for existing orchestration: CI/CD configs
(`.github/workflows/`, `Jenkinsfile`, `buildkite.yml`), service mesh config,
pipeline definitions, architecture docs, existing integration code. Identify
patterns applicable to this orchestration:

| Pattern | Project example | Use when |
|---|---|---|
| Linear pipeline | GitHub Actions job chain | A → B → C, each stage gates the next |
| Evaluation loop | Polling worker + result handler | Run process → check condition → retry or advance |
| Fan-out then merge | Parallel test matrix / map-reduce | Parallel processing, one aggregated result |
| Gate-then-branch | Feature flag + conditional deploy | Cleared condition routes to different execution path |

If no existing orchestration patterns are found (greenfield project), proceed
from intent — recommend the pattern from the table above that best fits the
described orchestration, and note in the brief that this is a fresh introduction
rather than an extension of existing practice.

Recommend at least one pattern for adoption or adaptation. If none fits, design
from intent.

### Step 3 — Define interface contracts

For each component-to-component handoff, document:

```
Handoff: [caller] → [called component]
Trigger condition: when/how the caller invokes the called component
Expected input: what the caller must provide (parameters, payload schema, headers)
Expected output: what format/schema/signals the caller reads
Verdict signals: specific values that drive branching (HTTP 200, exit code 0, queue message type, boolean flag)
Error surface: what happens on unexpected output (retry, dead-letter, fallback, alert)
```

Every handoff must have a contract. An undocumented handoff is an unmitigated
integration risk.

### Step 4 — Produce the wiring plan

Write a wiring diagram in pseudocode:

```
orchestrating_component:
  Step 1: [component-a] → produces [what]
  Step 2: read [signal from component-a output]
    signal = X → Step 3
    signal = Y → Step 4
  Step 3: [component-b] → produces [what]
  ...
```

Present the wiring plan and contracts to the user before continuing.

If decomposition candidates were flagged in Step 1, append a "Post-decomposition topology (design annotation)" section to the wiring plan. For each candidate: if pure, show two atomic components replacing one; if composed, show two separate pipeline trees. Label the section clearly — this is forward design, not a recommendation.

### Step 5 — Produce the orchestration brief

Write the orchestration brief:
- System name / orchestration scope
- One-paragraph intent statement
- List of components, each with its interface contract
- Wiring diagram
- Flagged gaps (components with no readable spec or not yet implemented)
- Decomposition candidates: for each flagged component, its classification (pure/composed), the two responsibilities or pipelines identified, and which consumers depend on each. Omit this bullet if no candidates were flagged.
- Recommended next steps (implementation planning, ADR authoring, architecture
  review)

Present the brief directly to the user. This is the terminal deliverable.

## Output

- **Wiring plan** — pseudocode diagram of all component calls and branching
  conditions
- **Interface contracts** — one contract block per handoff
- **Orchestration brief** — intent, component list with contracts, wiring
  diagram, flagged gaps, recommended next steps

## Transitions

To implement the components defined in this brief, open an implementation
planning session. To document architectural decisions surfaced during this
design, author an ADR. For Claude skill orchestration specifically, use
`/skill-weave`.
