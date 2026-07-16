---
name: critical-path-theory
description: >
  Apply Critical Path Method (CPM) to project schedules — build a task
  dependency network, run forward and backward passes, calculate total float
  per task, and identify the critical path with a schedule risk summary.
  Trigger on: "find the critical path", "analyze my project schedule",
  "calculate project float", "apply CPM to this task list", "which tasks have
  zero slack", "critical path analysis", "schedule risk analysis", or
  "/critical-path-theory".
  Do NOT trigger for researching CPM software documentation — use
  /tech-doc-research for that. Do NOT trigger when live scheduling data or
  current benchmarks are needed standalone — use /fresh-data for that.
  Do NOT trigger for general project planning or task decomposition — use
  /shaping-for-ai for that.
user-invocable: true
---

# Critical Path Theory

Apply Critical Path Method (CPM) to any project described as a task list with
durations and dependencies. Produce a complete analysis: task network, ES/EF/LS/LF
values per task, total float, a named critical path, and a schedule risk summary.
Success is a verified, reproducible result — not a polished presentation.

## Values

- **Show your work.** Always display the full ES/EF/LS/LF calculation table.
  A critical path stated without visible arithmetic is unverifiable.
- **Ask before assuming.** Never invent durations, dependencies, or units.
  Incomplete input blocks forward — ask before calculating.
- **Precision over polish.** A correct table beats a styled diagram with a
  rounding error.

## Constraints

- Never assume task durations or dependencies the user hasn't provided.
- Never state a critical path without completing both forward and backward passes.
- If the network contains a dependency cycle, stop and report it — do not continue.
- Do not perform PERT / Monte Carlo simulation unless explicitly requested.
  Treat all durations as deterministic unless the user provides three-point estimates.
- If mixed time units appear (days vs. weeks), ask the user which unit to normalize to before calculating. If the user asks you to choose, default to the smaller unit (days) and state the choice explicitly in the output.
- If any tasks may overlap or require gaps between them, ask about lead/lag time
  before building the network.

## Workflow

### 1. Gather inputs

Collect: task list, durations in consistent units, predecessor relationships, and
lead/lag time if any tasks overlap or require gaps. If any are missing or ambiguous,
ask before proceeding.

### 2. Build the network

List all tasks with their immediate predecessors. For networks with more than 10
tasks, or any network where a task has 3 or more predecessors, confirm the full
dependency table with the user before running any calculations. Detect and report
cycles before proceeding.

### 3. Forward pass

Process tasks in topological order:
- ES of start tasks = 0
- ES of each task = max(EF of all predecessors)
- EF = ES + Duration

Present ES and EF for every task in a table before continuing.

### 4. Backward pass

Work backward from the project end:
- LF of the final task(s) = EF of the latest-finishing task (project duration)
- When multiple tasks have no successors, each gets LF = project duration
- LF of each task = min(LS of all successors)
- LS = LF − Duration

Extend the table with LS and LF columns.

### 5. Calculate float

For each task:
- **Total Float** = LS − ES (equivalently: LF − EF)
- **Free Float** = ES of earliest successor − EF of this task
- **Terminal tasks** (no successors): Free Float = project duration − EF, which equals Total Float

Mark tasks with Total Float = 0 as **critical**. If Total Float is negative for
any task, stop immediately: post a message identifying the infeasible task(s),
state the magnitude of the violation (how far negative), and ask the user how to
proceed (revise durations, remove constraints, or accept infeasibility). Do not
proceed to Step 6 until the user responds.

**Example — 3-task chain with one parallel task:**

| Task | Dur | ES | EF | LS | LF | TF | FF | Critical? |
|---|---|---|---|---|---|---|---|---|
| A | 3 | 0 | 3 | 0 | 3 | 0 | 0 | ✓ |
| B | 2 | 3 | 5 | 3 | 5 | 0 | 0 | ✓ |
| C | 4 | 5 | 9 | 5 | 9 | 0 | 0 | ✓ |
| D | 1 | 0 | 1 | 4 | 5 | 4 | 4 | — |

D runs parallel (predecessors: none; successor: C). FF_D = ES_C − EF_D = 5 − 1 = 4.

### 6. Identify the critical path

List the chain(s) of critical tasks from start to finish as:
`Task A → Task B → Task C (N units)`. If multiple critical paths exist, list all.
State the project duration.

### 7. Surface schedule risk

For each critical task: note what it depends on and what depends on it.
Flag tasks with Total Float ≤ 10% of project duration as near-critical (adjust
this threshold to context — some teams use 2 days absolute; others use 5%).
Offer fast-tracking or crashing options only if the user asks for schedule compression.

### 8. Transitions

- If the user wants to research CPM software (MS Project, Primavera, P6, etc.),
  invoke `/tech-doc-research`.
- If current benchmarks, live industry data, or up-to-date scheduling standards
  are needed, invoke `/fresh-data` before or alongside the analysis.

## Output Format

Produce output in this order:

1. **Task Network** — table: Task | Duration | Predecessors
2. **CPM Calculation** — table: Task | Dur | ES | EF | LS | LF | TF | FF | Critical?
3. **Critical Path** — one line per path: `A → B → C (N units)`
4. **Schedule Risk Summary** — bullets listing critical and near-critical risks
5. *(On request)* **Compression Options** — fast-tracking or crashing candidates
