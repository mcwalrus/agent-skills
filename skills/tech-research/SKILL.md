---
name: tech-stack-research
description: >
  Research technology stack solutions by scouring GitHub and the web for open-source
  libraries, reference implementations, and proprietary/SaaS alternatives. Use whenever
  the user wants to find the best tool or library for a problem, evaluate options before
  committing to a stack, compare open-source vs paid solutions, or get an opinionated
  recommendation backed by real-world data.

  Trigger for: "what should I use for X", "find me a library for", "what's the best tool
  to", "are there GitHub projects that", "I need something that does X", "evaluate options
  for", "compare solutions for", "help me choose a stack for", "what open-source tools
  exist for", "is there a SaaS for", "find me an alternative to", "what does the ecosystem
  look like for", or any request exploring the solution landscape before writing code.

  Always use this instead of guessing from training data — training data is stale.
---

# Tech Stack Research

## Purpose

Find real, current solutions to technical problems before committing to an approach.
This skill combines GitHub search, web research, and structured evaluation to surface
the best open-source and proprietary options — with honest trade-off analysis and a
clear recommendation.

**Core principle:** Training data is stale and biased toward what was popular at
training time. Real solutions require real research. Always search before recommending.

---

## Research Process

### Step 1: Understand the Problem

Before searching, clarify the problem space. Extract from the user's request:

- **Core capability needed** — What must the solution do?
- **Stack context** — Language, framework, runtime (Node, Python, Rust, etc.)
- **Scale requirements** — Hobby project, startup, production system?
- **Constraints** — Self-hosted vs. hosted, open-source required, budget, compliance
- **Integration points** — What does this need to connect to?

If critical information is missing and would substantially change the search (e.g.
language is unknown), ask one focused question. Otherwise, proceed with reasonable
assumptions and state them.

---

### Step 2: GitHub Search Strategy

Run **3–5 targeted GitHub searches** using `web_search` with GitHub-specific queries.
Vary the angle with each search to avoid returning the same results.

**Query patterns to use:**

```
site:github.com <technology> <problem domain>
github.com <keyword> <language> library
"awesome-<domain>" github.com
site:github.com <problem> stars:>500
github <capability> production ready 2024 OR 2025
```

**What to look for in results:**

| Signal | What it means |
|--------|---------------|
| Stars (1k+) | Widely adopted |
| Recent commits | Actively maintained |
| Open issues ratio | Healthy community vs. abandoned |
| README quality | Reflects project maturity |
| Used by (GitHub) | Real production adoption |
| License | MIT/Apache = permissive; GPL = copyleft considerations |

**Fetch key repositories** with `web_fetch` when the search snippet isn't enough.
Read the README for: installation complexity, API style, maintenance status, known
limitations, and whether it matches the stated use case.

---

### Step 3: Proprietary / SaaS Research

After GitHub, run **2–3 searches for commercial solutions**:

```
best <problem domain> SaaS 2025
<problem> managed service vs self-hosted
<capability> commercial alternatives
```

Evaluate proprietary options on:
- Pricing model (per-seat, usage-based, flat)
- Vendor lock-in risk
- Data sovereignty / compliance (relevant for NZ/AU contexts)
- Free tier / trial availability
- How they compare to the best open-source alternative

---

### Step 4: Community Signal

Check for practitioner opinions — these surface tradeoffs that docs won't admit:

```
site:news.ycombinator.com <technology> OR <problem domain>
reddit.com <subreddit> best library for <problem>
<technology A> vs <technology B> 2025
```

Also check:
- The Pragmatic Engineer newsletter (for engineering tooling)
- dev.to, lobste.rs for niche library discussions
- GitHub Discussions on the major contenders

---

### Step 5: Structured Evaluation

After research, produce a comparison table covering all serious contenders:

```
| Solution | Type | Stars/Usage | Maintained | License | Best for | Avoid if |
```

Then provide **three tiers** of recommendation:

**🥇 Recommended** — Best fit for the stated problem and context. Specific reason why.

**🥈 Strong Alternative** — When the recommended doesn't fit (different constraints).
Name the constraint it serves better.

**🥉 Watch List** — Newer or less proven, but worth knowing about. Why it might
matter in 6–12 months.

---

### Step 6: Recommendation Format

Structure the final output as:

```
## TL;DR
One-sentence recommendation with the winning solution named.

## Problem Understanding
What you're actually solving (including any assumptions made).

## Solutions Found

### Open Source
[Table of GitHub options with key metrics]

### Proprietary / SaaS
[Table of commercial options with pricing tier and lock-in assessment]

## Recommendation

### 🥇 [Solution Name]
Why it wins for this use case. Key selling points. Known limitations. 
Getting started pointer (repo link or docs URL).

### 🥈 [Alternative]
When to choose this instead. What trade-off it addresses.

### 🥉 [Watch List] (optional)
Emerging option worth monitoring.

## Stack Fit
How the winner integrates with the user's stated stack.
Any known gotchas for the integration.

## Further Reading
2–3 links: repo, docs, or a practitioner write-up.
```

---

## Research Quality Standards

**DO:**
- Fetch the actual README of top candidates, not just search snippets
- Check when the last commit was — abandoned repos get noted
- Look at the issues tab for common complaints
- Note if a library is used by recognisable projects (signals real-world validation)
- Be honest about limitations of the recommended option

**DO NOT:**
- Recommend based on training data alone without searching
- List every library found — curate to the top 4–6 that matter
- Ignore licence implications (GPL vs MIT matters for commercial use)
- Omit pricing for proprietary solutions
- Recommend a solution that hasn't had a commit in 2+ years without flagging it

---

## Special Cases

### "Awesome list" exists
If an `awesome-<domain>` curated list exists on GitHub, fetch it. These are
community-maintained registries of the best tools in a space. Use them as a
discovery layer, then go deeper on the top candidates.

### Greenfield vs. Brownfield
If the user is adding to an existing stack (brownfield), weight compatibility
and integration complexity more heavily than raw capability. The "best" library
in isolation may be the wrong choice if it fights the existing architecture.

### NZ / AU context
For users in New Zealand or Australia, flag:
- Data residency options (AU/NZ data sovereignty)
- Latency considerations (AP-Southeast vs US regions)
- Whether the vendor has local presence or support

### Agent / AI workloads
For agent infrastructure, prioritise:
- MCP server availability (see BACKPRESSURE.md principle: attach inspection tools)
- TypeScript / Python SDK quality (agent frameworks live and die by SDK quality)
- Streaming support and structured output capabilities
- Whether the tool has been adopted by the Claude Code / Cursor ecosystem

---

## Example Searches for Common Problem Types

**Auth / Identity:**
```
site:github.com authentication library nodejs stars:>2000
"self-hosted auth" github.com 2025
site:news.ycombinator.com "auth" "self-hosted" 2024
```

**Databases / Storage:**
```
site:github.com embedded database <language>
"serverless database" github.com edge
<database-type> vs <database-type> 2025 production
```

**Queues / Jobs:**
```
site:github.com job queue <language> stars:>1000
background jobs <framework> github
bullmq vs <alternative> 2025
```

**Observability:**
```
site:github.com opentelemetry <language> sdk
self-hosted observability stack github
<vendor> vs grafana stack 2025
```

**AI / LLM tooling:**
```
site:github.com LLM agent framework <language>
MCP server <capability> github.com
"claude code" OR "cursor" compatible <tool> github
```
