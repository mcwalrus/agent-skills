---
name: mermaid-diagrams
description: >
  Creates useful Mermaid diagrams for SWE, DevOps, and Platform Engineering work —
  PRs, ADRs, RFCs, runbooks, incident reviews, roadmaps, system architecture, and
  more. Use this skill whenever the user wants to visualize a technical initiative,
  system change, workflow, deployment pipeline, data model, service topology,
  observability setup, or any process across codebases and platforms. Trigger even
  when the user says things like "draw this", "diagram this", "help me explain this
  change", "make a flowchart", "show how X works", or "how should I document this
  PR / RFC / runbook". The skill picks the right diagram type(s), generates valid
  Mermaid syntax, and composes multi-diagram docs when one view isn't enough.
---

# Mermaid Diagrams for SWE / DevOps / Platform Engineering

You are helping an engineer produce Mermaid diagrams that communicate technical
initiatives clearly — changes across codebases, infrastructure, pipelines, data
models, and platforms. Your job is to (a) understand what they're trying to show,
(b) choose the right diagram type(s), and (c) generate syntactically valid Mermaid
that renders on GitHub, GitLab, Notion, and other common platforms.

---

## Workflow

### 1. Understand the initiative

Before generating anything, get clear on what the user is trying to communicate.
Ask the minimum questions needed — don't over-interview, but don't guess at the
important parts. Key things to understand:

- **What changed / is changing?** (a new service, a refactor, a deployment process,
  a data model, a branching strategy, a rollout plan…)
- **Who's the audience?** (teammates in a PR review, stakeholders reading an RFC,
  on-call engineers reading a runbook, leadership reading a roadmap)
- **What question should the diagram answer?** This is the most important one.
  A good diagram answers one question clearly. If the user has multiple questions,
  plan multiple diagrams.

Common questions → diagram types:

| Question the diagram should answer | Diagram type |
|------------------------------------|-------------|
| Who owns what code / which layer does what? | `flowchart` with subgraphs |
| What does the data look like at each step? | `flowchart LR` with edge labels |
| What happens when N callers hit this at once? | `sequenceDiagram` with `par/and` |
| What changed (before vs after)? | Paired `flowchart` subgraphs |
| How do we roll this out / migrate? | `flowchart` with Before→Flagged→After subgraphs |
| What states does this object / job live in? | `stateDiagram-v2` |
| How do requests flow through the system? | `sequenceDiagram` with timing notes |
| What is the system context at a high level? | `C4Context` or `C4Container` |
| What does the cloud topology look like? | `architecture-beta` |
| What's the project / initiative schedule? | `gantt` |
| What's the branching / release strategy? | `gitGraph` |
| How do metrics / costs distribute? | `xychart-beta`, `sankey-beta`, `pie` |
| How does this compare across multiple axes? | `radar-beta` |
| How are requirements / SLAs linked? | `requirementDiagram` |
| What work is in flight (sprint, incidents)? | `kanban` |
| How do ideas / capabilities decompose? | `mindmap` |
| What are the priorities (effort vs impact)? | `quadrantChart` |
| What does the DB schema look like? | `erDiagram` |
| What are the domain classes? | `classDiagram` |
| What's the git branching model? | `gitGraph` |

### 2. Plan the diagram set

Real-world docs need 3–7 small, focused diagrams — not one giant one. Use the
**one diagram per question** rule. If the user's initiative has multiple angles
(ownership, data flow, runtime behavior, rollout), plan one diagram per angle.

Common doc types and their diagram combos:

| Doc type | Diagram combo |
|----------|---------------|
| PR description | Layered ownership (flowchart) + hot-path sequence + lifecycle state |
| ADR / RFC | C4 context + before/after flowchart + rollout migration path |
| Incident review | Gantt (timeline) + sequence (request trace) + flowchart (mitigation) |
| Runbook | Flowchart (decision tree) + sequence (commands) |
| SLO doc | Flowchart (SLO tree) + XY chart (history) + radar (multi-SLO) |
| Platform RFC | C4 + architecture-beta (cloud) + sankey (cost / resource) |
| Capacity plan | XY chart (trend) + gantt (roadmap) + quadrant (priority) |
| Roadmap | Timeline (milestones) + gantt (phased schedule) + kanban (current queue) |

Tell the user which diagrams you're going to create and why before generating
them. Keep each diagram small (under ~20 nodes for flowcharts; a few participants
for sequences). If a single diagram is getting unwieldy, split it.

### 3. Generate valid Mermaid

Write the diagram in a fenced ` ```mermaid ` code block. Always verify the syntax
mentally against the quick-reference rules before outputting. Common mistakes that
break rendering:

- Using reserved words (`end`, `graph`, `subgraph`, `default`) as bare node IDs →
  quote them: `A["end"]`
- Special chars in labels (`&`, `"`, `#`) → use HTML entities or avoid them
- Architecture diagram: `architecture-beta` (not `architecture`) — same for
  `radar-beta`, `sankey-beta`, `packet-beta`, `xychart-beta`
- Flowchart direction in subgraphs is overridden by connections to outside nodes;
  set direction on the parent or avoid cross-subgraph direction conflicts
- `%%{init}%%` directives are deprecated since v10.5.0 — use YAML frontmatter
  `config:` block instead

If the user's platform might not support newer diagram types (Packet v11.0+,
Architecture v11.1+, Radar v11.6+), note a fallback (usually `flowchart`).

### 4. Add context and explain choices

After each diagram:
- Write a 1–2 sentence caption explaining what the reader should take away
- Note any design decisions (why this type? why this layout?)
- If the diagram is part of a multi-diagram set, link the pieces with prose

---

## Seven documentation patterns

These are battle-tested patterns for PR descriptions, ADRs, and RFCs. Load
`references/patterns.md` when you need detailed examples and worked code.

| Pattern | Question it answers | Diagram |
|---------|--------------------|---------| 
| 1. Layered ownership | Who owns what code / layer? | `flowchart` + subgraphs |
| 2. Data flow | What does the data look like at each step? | `flowchart LR` with edge labels |
| 3. Async fan-in | What happens under concurrency? | `sequenceDiagram` with `par/and` |
| 4. Before / after | What changed? | Paired subgraphs, dotted for new paths |
| 5. Config evolution | How does config ownership change? | `flowchart` showing resource boundaries |
| 6. Object lifecycle | What states does this object live in? | `stateDiagram-v2` |
| 7. Migration path | How do we get from old to new? | Three subgraphs: Before → Flagged → After |

---

## Diagram type quick reference

For syntax details, load `references/syntax.md`.
For audience-specific examples (SWE / DevOps / Platform), load `references/audience-examples.md`.

Key facts you'll use most often:

**Flowchart directions:** `TB` (top→bottom, default), `LR` (left→right), `BT`, `RL`

**Flowchart node shapes:**
```
[rect]  (round)  ([stadium])  [(cylinder)]  ((circle))
{diamond}  {{hexagon}}  [/parallelogram/]  >asym]
```

**Sequence arrows:** `->>` (solid arrow, most common), `-->>` (dashed), `<<->>` (bidirectional)

**Sequence blocks:** `par/and/end` (concurrent), `alt/else/end` (conditional), `loop/end`, `opt/end`

**State:** `[*] --> State : trigger` — use `stateDiagram-v2` (not v1)

**Gantt tags:** `done`, `active`, `crit`, `milestone` — combine with `:id, start, duration`

**Gitgraph:** `commit` → `branch name` → `checkout name` → `commit` → `checkout main` → `merge name`

**C4 levels:** `C4Context` (system), `C4Container` (services), `C4Component` (internals)

**classDef styling:**
```mermaid
flowchart LR
  A:::new --> B:::existing
  classDef new fill:#fff4dd,stroke:#aaa,color:#000
  classDef existing fill:#ddf4ff,stroke:#aaa
```

---

## Tips for platform / multi-codebase initiatives

Since the user is mapping initiatives across multiple platforms and codebases,
lean toward:

- **C4 diagrams** for cross-system context — show which system lives where and
  how they relate before drilling into any one codebase
- **Architecture-beta** for cloud topologies — groups map cleanly to services /
  namespaces / accounts
- **Before/after paired subgraphs** for changes that span multiple repos —
  label each subgraph with the affected repo/service
- **Gitgraph** when the initiative involves coordinated branching across repos
- **Gantt or Timeline** when the initiative has a phased rollout across services
- **Sankey** when you need to show how work / cost / load is distributed across
  teams or services

If the initiative touches a dozen services, don't try to put them all in one
diagram. Instead, draw a zoomed-out C4 context, then one or two zoom-in diagrams
on the interesting parts.

---

## Reference files

Load these when you need them — don't load all at once:

- `references/syntax.md` — Full syntax cheatsheet for all 19 diagram types
- `references/patterns.md` — Worked examples of the 7 documentation patterns
- `references/audience-examples.md` — SWE / DevOps / Platform examples by diagram type
