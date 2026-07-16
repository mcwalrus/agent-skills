# Agent Skills

A collection of agent skills maintained by Max Collier. Skills follow the [Agent Skills](https://agentskills.io/) format and can be installed via the vercel-labs/skills CLI.

[![skills.sh](https://skills.sh/b/mcwalrus/agent-skills)](https://skills.sh/mcwalrus/agent-skills)

## Installation

```bash
npx skills add mcwalrus/agent-skills
```

Install specific skills:

```bash
npx skills add mcwalrus/agent-skills --skill skill-forge
npx skills add mcwalrus/agent-skills --skill backpressure
```

## Available Skills

### automations-engineer

Guide agents to respond to any problem by designing a gascity closed-loop automation rather than solving the problem directly.

### backpressure

Load this skill when evaluating, designing, or troubleshooting the feedback infrastructure around an agent workflow.

### boring-code

Write code the boring way — the most obvious implementation that solves the real problem today, readable by a stranger in 30 seconds.

### calibration-loop

Maintain accurate short-term capability projection and active task alignment in agentic work — correct under-confident scope estimates grounded in outdated assumptions about AI capability, surface drift before it compounds, and propose feedback checkpoints that keep tasks on course.

### clarify-requirements

Uncover a user's hidden and ambiguous requirements by asking only the targeted clarifying questions needed to understand how they want a problem solved, then confirm that understanding before any solving begins.

### cover-your-tracks

Ensure every code change leaves behind tests, integration checks, or at minimum a captured TODO for later validation.

### creative-dreamer

Activate a pure creative ideation mode where all possibilities are valid, nothing is filtered, and no idea is too bold.

### creative-ideas

Generate novel ideas with genuine creative merit from stated problems — problem-anchored, not open-ended.

### creative-process

Turn a rough plan into a gate-cleared spec through automated iterative refinement.

### critical-path-theory

Apply Critical Path Method (CPM) to project schedules — build a task dependency network, run forward and backward passes, calculate total float per task, and identify the critical path with a schedule risk summary.

### dev-env-bootstrap

Scaffold `.claude/settings.json` and `.claude/settings.local.json` for permissive local development.

### first-principles

First-principles reasoning: strip a problem to its irreducible, verifiable truths, discard inherited assumptions, analogies, and convention, then rebuild a conclusion from the fundamentals up — with every layer made visible.

### future-max

Review ideas, plans, and decisions as future-Max — six months forward, having lived with the consequences.

### gc-setup

Install, configure, and validate a gascity city — covering all required dependencies (gc, dolt, bd, flock, tmux) and initialising a minimal working city.toml with at least one agent.

### heresy-hunt

Surface and remove accumulated ideas, assumptions, or conventions that have lost relevance, stopped being true, or are silently degrading quality.

### mcp-setup

Set up MCP servers, LSP backends, and Claude Code monitors — interactive and security-first.

### regret-register

Structure and persist project regrets and learnings as beads issues so they survive session end and are queryable by label.

### skill-forge

Guide complete creation of a new agent skill from scratch — eliciting intent, drafting frontmatter and body in trust-calibrated structure, determining structural tier and authoring all supporting files, checking routing conflicts against existing skills, running inline trust and conventions passes, and gate-checking with creative-sentinel before writing all files to disk.

### skill-trust-audit

Audit a skill, prompt, or agent instruction set against the values of trusted agent autonomy — determining what must be explicit, what can be safely delegated to agent reasoning, and where the skill over- or under-specifies.

### storyboard

Map the experience of encountering any exposed software surface — UI, CLI, API, protocol, agent tool interface, or any other interaction point — as a sequence of panels that makes the user or caller's experience visible and concrete before implementation begins.

### tech-course

Generate a complete, mental-model-first course on any technology — a landing README, a CHEATSHEET, and dependency-ordered numbered course units, each following a fixed learn → why → concepts → exercises → self-checks → takeaways template, grounded in primary sources before any content is written and with the syllabus confirmed first.

### tech-guide

Orient new contributors and developers to a repository or technology through structured, planned exploration.

### tech-stack-research

Research technology stack solutions by scouring GitHub and the web for open-source libraries, reference implementations, and proprietary/SaaS alternatives.

### three-rooms

Walt Disney's Three Rooms method — develop a single idea by passing it through three separate mindsets in strict sequence: Dreamer (every way it could go), Realist (the practical elements to build it), Critic (what must be resolved to make it real).

### walt-walk

Walk through an agent skill file from the perspective of an agent executor — inhabiting the skill step by step to surface ambiguities, assumed knowledge, missing context, decision points without guidance, and places where the agent would stall, guess, or go wrong.

### weave-ideas

Weave a concept into an existing project — survey the project landscape for supporting and opposing ideas, run a comparative review, then place the idea as a concrete project artifact.

### weave-projects

Design orchestration briefs for multi-component project systems — microservices, API pipelines, CI/CD workflows, build systems, multi-agent architectures, or any system where software components call other components.

### weave-skills

Design and document orchestration skills that call other skills programmatically.

## Skill Structure

Each skill is a directory under `skills/` with:

- `SKILL.md` — the skill instructions with YAML frontmatter
- `references/`, `scripts/`, `assets/` (optional) — supporting files

See [agentskills.io/specification](https://agentskills.io/specification) for the full format.

## License

MIT