---
name: creative-process
description: >
  Turn a rough plan into a gate-cleared spec through automated iterative
  refinement. Runs creative-planner in the main agent for interactive planning,
  then loops — spawning a fresh sub-agent each pass — through planner → sentinel
  until GATE: CLEARED, followed by one post-clearance sentinel confirmation. Use when a plan needs more than a single review —
  autonomous continuation when unambiguous, user input when ambiguous. Trigger
  on phrases like "refine this plan until it clears", "run the creative process
  on this", "pressure-test this plan before I commit", "gate-clear this", or
  /creative-process. For a single evaluation pass use creative-crictic; for a
  single gate check use creative-sentinel; for planning alone use
  creative-planner.
user-invocable: true
---

# Creative Process

Turn a rough plan into a gate-cleared spec through automated iterative
refinement. The main agent runs creative-planner once for an interactive
planning pass, then loops — spawning a fresh sub-agent each pass — through
planner → sentinel until the gate clears. Accumulated context (plan and
decisions) is carried forward explicitly in every spawn prompt. On clearance,
one post-clearance sentinel pass closes the session.

```
main_agent:
  /creative-planner                        ← interactive planning pass
  input        = plan from creative-planner
  decisions    = []
  cleared_plan = null

  evaluation loop (new sub-agent each pass):
    agent = spawn(evaluation template: input, decisions)
    agent: /creative-planner → /creative-sentinel

    GATE: CLEARED     → cleared_plan = agent.updated_plan → post-clearance pass
    GATE: CONDITIONAL
    GATE: BLOCKED     → read Assessment:
      unambiguous → input = agent.updated_plan → loop
      ambiguous   → surface to user → collect feedback → loop

  post-clearance pass (new sub-agent):
    agent = spawn(post-clearance template: cleared_plan, decisions)
    agent: /creative-sentinel

    REFINED    → present final plan and decisions to user → done
    PRESERVED  → present final plan and decisions to user
                 (note: post-clearance refinement did not pass the gate;
                  plan is from the original cleared plan)
```

---

## Main Agent Workflow

### Step 1 — Run creative-planner

Invoke `/creative-planner` via the Skill tool — run a full interactive planning
pass with the user. The output is the initial plan that enters the loop.

### Step 2 — Initialize

- **current input** — the plan produced in Step 1
- **decisions log** — empty; accumulates across all passes
- **cleared plan** — not yet set

### Step 3 — First evaluation pass

Read the **Sub-Agent Spawn Prompt** section below before constructing the prompt
— it provides the exact templates for evaluation and post-clearance spawns.

Spawn a sub-agent using the Agent tool. Use the evaluation spawn template:
- Current input (the plan from Step 1)
- Accumulated decisions ("None yet")
- The full sub-agent instructions verbatim, between `--- BEGIN ---` and
  `--- END ---` in the Sub-Agent Spawn Prompt section

Then go to Step 4.

### Step 4 — Evaluation loop

Parse the sub-agent's response:
- Extract **updated plan** and **decisions**; append decisions to the log
- **Present the decisions to the user** — surface them in your response and
  immediately continue without pausing for user acknowledgment
- Check verdict:
  - `GATE: CLEARED` → capture the updated plan as the cleared plan; go to Step 5
  - `GATE: CONDITIONAL` or `GATE: BLOCKED` → read the sub-agent's **Assessment**:
    - `unambiguous` → spawn a new sub-agent using the evaluation spawn template
      (updated plan + accumulated decisions); repeat Step 4
    - `ambiguous` → surface the conditions or blockers to the user; collect
      feedback; spawn a new sub-agent using the evaluation spawn template
      (updated plan + user feedback + accumulated decisions); repeat Step 4

The loop continues — new sub-agent each pass, accumulated decisions log carried
forward — until `GATE: CLEARED`.

### Step 5 — Post-clearance pass

Spawn a new sub-agent using the Agent tool with the post-clearance spawn
template. Include:
- The cleared plan (captured in Step 4)
- The full accumulated decisions log
- The full sub-agent instructions verbatim (BEGIN/END block)

Parse the response:
- Extract `Post-clearance Status`: `REFINED` or `PRESERVED`
- `PRESERVED` — sentinel confirmed the cleared plan; present as-is
- `REFINED` — sentinel amended the plan; present the updated version
- Present the final plan and accumulated decisions log to the user

---

## Sub-Agent Architecture

A new sub-agent is spawned for each evaluation pass and the post-clearance pass.
Each agent runs once and returns its response. Accumulated context — the full
plan and decisions log — is carried forward explicitly in every spawn prompt.
Every spawn includes the full BEGIN/END instructions.

---

## Sub-Agent Spawn Prompt

All spawns follow this structure: variable section first, then the BEGIN/END
instructions appended verbatim.

**Evaluation spawn template (Steps 3 and 4):**

```
Message: evaluation

Current plan:
{current plan}

[Include only if user feedback was collected:]
User feedback:
{feedback}

Accumulated decisions:
{decisions log, or "None yet"}
```

**Post-clearance spawn template (Step 5):**

```
Message: post-clearance

Cleared plan:
{cleared plan captured at GATE: CLEARED}

Accumulated decisions:
{full decisions log}
```

Append everything between `--- BEGIN ---` and `--- END ---` verbatim to every
spawn prompt.

--- BEGIN ---

You are a creative-process evaluation agent. You run one pass — either an
evaluation pass or a post-clearance pass — and return your response. You will
not receive another message; return your full response and stop.

**On each evaluation pass (`Message: evaluation`):**

1. Invoke `/creative-planner` via the Skill tool — refine the current plan.
   If user feedback was included in this message, treat it as direction for
   the planning pass. Creative-planner may generate questions if the context
   is insufficient — if it does, assess and answer them yourself using the
   current plan and any provided context; do not wait for user input. Record
   every decision you make this way in the Decisions section of your response.
2. Invoke `/creative-sentinel` via the Skill tool — run a full gate check on
   the refined plan.
3. Return your response in the format below.

**On post-clearance pass (`Message: post-clearance`):**

The plan has cleared the gate. Confirm it is sound — this is a final
clean-room check. Sentinel has full accumulated context from the session;
this is its last opportunity to surface anything missed.

1. Invoke `/creative-sentinel` via the Skill tool — confirm the cleared plan.
2. If the sentinel clears (no new blockers, no plan text changes):
   - Return `Post-clearance Status: PRESERVED`
3. If the sentinel clears but explicitly amends or adds to the plan text:
   - Return `Post-clearance Status: REFINED`
4. If the sentinel does not clear:
   - Return `Post-clearance Status: PRESERVED`

Return the response format below.

**Evaluation response format:**

## Updated Plan

{The full plan as revised through this turn.}

## Decisions

{Key decisions made this turn that materially shaped the plan.
One line each: the decision and why. Write "None" if no material decisions.}

## Verdict

Write exactly one of:
GATE: CLEARED
GATE: BLOCKED
GATE: CONDITIONAL

{If BLOCKED or CONDITIONAL — include Assessment on the next line.
Write exactly one of:}
Assessment: unambiguous
Assessment: ambiguous

unambiguous — what needs to change is clear; the next evaluation pass can
             resolve it without user input
ambiguous   — a decision or clarification is needed that only the user
             can provide

{If BLOCKED:}
Blockers:
{numbered list}

{If CONDITIONAL:}
Conditions:
{numbered list}

**Post-clearance response format:**

## Post-clearance Status

Write exactly one of:
REFINED
PRESERVED

{PRESERVED: sentinel confirmed the cleared plan with no changes — present as-is.}
{REFINED: sentinel amended or added to the plan text — present the updated version.}

## Final Plan

{The full final plan.}

## Decisions

{All decisions from this turn combined with accumulated decisions.}

## Accepted Risks

{Open risks from sentinel's OPEN RISK findings. Write "None" if no open risks.}

--- END ---
