---
name: spell-it-out
description: Produce a structured, chained reasoning trace that makes how a problem was framed, explored, and resolved explicit and reviewable. Use when the user asks to "spell it out", "show your working", "walk me through your reasoning", "trace your thinking", or wants a retrospective of how a problem was identified or solved. Use also when the agent itself wants to slow down and expose its reasoning before acting, or to make implicit assumptions reviewable.
---

# Spell It Out

Produce a **Reasoning Trace** — a written chain of reasoning events that someone (you, the user, a reviewer) can follow from start to finish without having to reconstruct the logic. The aim is reviewable context, not performance.

Use this skill when the work is non-trivial enough that the *how* matters, not just the *what*.

## When to Use It

- The user explicitly asks you to spell out, show, or trace your reasoning.
- A problem is being diagnosed or solved and the path matters as much as the answer.
- You are about to make a non-obvious decision and want the choice to be defensible.
- Retrospectively: looking back at work already done, to capture how a conclusion was reached.
- Prospectively: at the start of a task, to make your framing visible before you commit to it.

Do **not** use it for trivial lookups, single-step commands, or where the reasoning is self-evident from the output.

## The Reasoning Trace

Structure the output in six sections. Be specific. Name things. Avoid filler.

### 1. Frame

State the problem or question in your own words, as you currently understand it.

- What is being asked or solved?
- What is *not* being asked? (Boundary.)
- What would "done" look like?

### 2. Anchor

Separate **observed** from **assumed**.

- What facts, outputs, tool results, or quotes do you actually have?
- What are you taking for granted? Mark assumptions explicitly — they are the most common source of error.
- What is unknown? List it. Empty unknowns are a smell.

### 3. Chain

A numbered sequence of reasoning events. Each event must:

- Reference what it follows from (previous event number, observation, or assumption).
- State the new conclusion or move it produces.
- Be one logical step — not a paragraph of leaps.

Format each event as:
> **[n] From <prior>: <what you did with it> → <new claim>.**

If you skip a step, that is itself an event worth naming. Hidden jumps are the whole thing this skill exists to prevent.

### 4. Branch Points

Identify moments where the chain could have gone differently.

- What alternative did you consider?
- Why did you pick the path you did?
- What would change your mind?

If there were no real branch points, say so — that is also useful information.

### 5. Resolve

Your current best understanding or decision, in one or two sentences. This should be a *consequence* of the chain, not a restatement of the frame.

### 6. Gaps

What is still uncertain, unverified, or worth a second look.

- Be honest. A clean gap list is more useful than a confident-sounding resolve.

## Style Rules

- Short, declarative sentences. No hedging clouds.
- Name your sources: "tool output X", "the user said Y", "I assumed Z because…".
- If a step is an intuition, say so — do not dress it up as deduction.
- If you realise mid-chain that an earlier step was wrong, stop, name the mistake, and restart the chain from the corrected step. Do not silently edit.

## After the Trace

Once the Reasoning Trace is written, hand it off to `/skill:plain-english` so the trace itself is rendered in clear, reviewable prose for the reader. The trace is the substance; plain English is the presentation. Continue as normal if the skill is not available in your harness.

## Optional Modes

- **Retrospective**: prepend "Looking back at…" and reconstruct the chain from evidence (commits, outputs, messages). Anchor heavily.
- **In-the-moment**: write the trace as you go, appending events. Resolve only when the work is actually resolved — not before.
