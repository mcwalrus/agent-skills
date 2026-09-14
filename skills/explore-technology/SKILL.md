---
name: explore-technology
description: A useful playbook for guiding users through exploring a codebase and platform together — reading source alongside documentation, validating with live tools rather than from memory. This could be used for A new library, API surface, a new language version, or frameworks.
---

# Objective

Explore a codebase or unfamiliar technology by reviewing the source alongside the product both interactive and iteratively. Cite current documentation rather than relying on training-era recall. Follow a structured approach with live exploration to verify your analysis alongside your investigation.

## Core values

- **Live over remembered** — run list tools, or interactive calls regularly; avoid describing claims from memory.
- **Cited over claimed** — every factual statement about a technology, dependency, or version carries a citation or interactive validation.
- **Planned over ad-hoc** — start with an exploration plan, then adapt as findings change.
- **Always be honest** - acknowledge your limitations. If you can't fetch something, say so.

## Stages

### 1. Orient

Ask what user wants to explore, their role if relevant, and what they most need to know the most.
If they name a technology without a local repo, or reference documentation, skip the filesystem probing and go to web research.

### 2. Plan

Build an exploration plan covering the user's role, goal, target, and the path you'll walk.
Cover entry points to inspect, technologies to look up, and landmarks to reach.
Don't touch the filesystem until a plan exists.
Adapt the plan as findings change.

### 3. Explore

Run filesystem tools in priority order:

1. `tree -L N` (or `eza --tree --level=N`) to see top-level structure.
2. Scan for standard entry-point / build files (`package.json`, `Makefile`, `Dockerfile`, `pyproject.toml`, etc.)
3. `ls -al` to catch hidden files, symlinks, and dotfiles.

Afterwards, run interactive tools to inspect the platform or technology:

1. Identify the best tools available through your harness.
2. Refer to playbooks or documentations on how the platform should work.
3. Ask questions to the user when interactions falls outside your expectations and your plan.

Note any findings against the plan before moving on.

### 4. Describe

Per turn, follow this rhythm:

- **Read** the next file or directory from the plan. Live, not from memory.
- **Observe** — make *one* connection between the current file and the broader system.
- **Discern** - anchor at design intent, system topology, or component relationships.
- **Steer** — ask one question to direct the next step.

Repeat until the user signals completion or the plan is exhausted.

### 5. Recap

Close the tour with:

- **Landmarks covered** — restate using the user's own framing.
- **Cited findings** — source-files or URLs and retrieval date.
- **Gaps** — 2–3 areas the plan identified but the tour did not reach.
- **Next steps** — provide concrete recommendations on what should follow.

## Underlying discipline

- **Breadth before depth** - Lay out the whole space before reading any single file deeply.
- **Public before hidden** - Visible structure and configs first, dotfiles second.
- **Shape before behavior** - Organise plan before entry points before live interactions.
- **Plan-checked** - Every finding is compared against the plan, not completed freely.

## Anti-patterns

- **Upfront reading** — opening files before the user has steered toward any of them. Burns context, when preempting their questions.
- **Multi-observation turns** — dumping "here are 6 things I noticed" instead of one observation + one question. Removes the user's ability to direct.
- **Explaining when unprompted** - volunteering function signatures, internal algorithms, line-level implementation detail, or boilerplate.
