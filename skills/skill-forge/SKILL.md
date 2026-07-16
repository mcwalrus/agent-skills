---
name: skill-forge
description: >
  Guide complete creation of a new agent skill from scratch — eliciting
  intent, drafting frontmatter and body in trust-calibrated structure,
  determining structural tier and authoring all supporting files, checking
  routing conflicts against existing skills, running inline trust and
  conventions passes, and gate-checking with creative-sentinel before writing
  all files to disk. Trigger on "create a skill", "build a new skill", "write
  a skill", "help me make a skill", "new skill for X", "skill that does X",
  or any request to author an agent skill file. Do NOT trigger for
  auditing existing skills (use skills-audit), evaluating trust calibration
  of a finished skill (use skill-trust-audit), or general quality review of a skill
  (use creative-sentinel).
user-invocable: true
---

# Skill Forge

Guide the complete creation of a new agent skill — from intent through
all deployed files. The goal is a production-ready skill: a correctly routed,
trust-calibrated SKILL.md plus any supporting files the skill requires
(scripts, reference docs, assets, examples). Quality is built in at authoring
time, not checked after the fact.

Operate autonomously. Infer what context allows; ask the user only when a
decision is genuinely ambiguous and would materially change the output. Surface
every decision made on the user's behalf explicitly — they can correct course,
but must not be required to approve each intermediate step.

---

## Values

- **Intent over steps.** A skill with clear intent and thin steps is more
  valuable than exhaustive steps with unclear purpose. The agent reasons from
  intent when instructions run out.
- **Calibrated trust.** Prefer values and constraints over prescribed
  sequences. Be explicit only where the stakes of misinterpretation are high.
- **Routing precision.** A skill that fires on the wrong prompt is worse than
  no skill. Trigger phrases must be distinctive, not generic.
- **Minimal surface area.** Start with SKILL.md alone. Add supporting files
  only when the content cannot fit in SKILL.md or requires execution. When
  the tier is ambiguous, prefer the lower tier — do not add files
  speculatively.
- **Reuse existing skills.** When a skill needs complex behaviour — planning,
  evaluation, auditing, trust-checking — invoke a relevant existing skill by
  name (if the harness provides a skill-invocation mechanism) rather than
  re-implementing the behaviour inline. If no such mechanism exists, run the
  behaviour inline.
- **Constraints before freedom.** Hard stops appear before open instructions.

---

## Constraints

- Never write any file before completing Phases 1–7.
- Never mark the trust-calibration pass complete without answering all five
  rubric questions and producing an explicit verdict.
- Never skip the routing conflict check. A skill without it may silently break
  existing routing.
- Do not embed vocabulary from skill-trust-audit or skills-audit (e.g. "acceptable
  gap", "guidable gap") in the skill body unless the audience explicitly knows
  those frameworks.
- Do not write any file without presenting the complete output to the user and
  receiving explicit approval.

---

## Phase 1 — Elicit

Infer everything you can from existing context before asking. State your
inferences explicitly. Ask only about genuine gaps — information the user
hasn't provided and you cannot reliably determine from context.

Core questions to resolve (by inference, confirmation, or explicit answer):

1. **Outcome** — What does this skill produce or enable? What does the agent
   do after invocation?
2. **Trigger** — What specific phrases or situations invoke this skill? Give
   2–3 concrete example phrasings.
3. **Boundary** — What adjacent skills exist, and when should those be used
   instead? These become negative triggers.
4. **Trust posture** — What must the agent always do or never do? What can it
   decide for itself given context?
5. **Done signal** — What does a successful output look like?
6. **Deployment context** — Is this skill being authored for the workflow-skills
   repo, or for an external project repo? If the user's request includes
   explicit path information naming a non-workflow-skills location, infer
   "external" and confirm. Otherwise, ask explicitly. Do not use current
   working directory as a proxy for deployment intent.

If the user has already described the skill in detail, synthesize answers from
that description and confirm rather than re-asking. A single confirmation
pass is a gate; five sequential gates are friction.

Do not proceed to Phase 2 until all six are resolved.

---

## Phase 2 — Draft Frontmatter

**name:** Lowercase, hyphenated, ≤64 characters. Lowercase letters, numbers,
and hyphens only. No leading/trailing hyphens, no consecutive hyphens. Must
match the directory name exactly and be distinct from existing skill names.

**description:** Use `>` folding block. Structure in order:
1. One outcome sentence.
2. Trigger phrases — each ≥3 words combining an action verb with a domain
   noun. Front-load the most distinctive phrases.
3. At least one negative trigger naming a sibling skill: "Do NOT trigger for
   [adjacent case] — use [skill] for that."

Description length calibration:
- Under 100 characters: triggers are likely underspecified — add examples.
- 100–400 characters: typical range; calibrate to skill complexity.
- Over 400 characters: check whether body content has leaked into the
  description. The description routes; the body instructs.

Maximum 1024 characters. Write for routing accuracy, not marketing.

**user-invocable:** If the harness supports user-invoked skills (e.g. via a
`/skill-name` command), set `true` when the user would invoke it directly,
`false` when it is a sub-skill called by other skills only. Omit the field on
harnesses that do not recognise it.

Present the frontmatter and continue to Phase 3. Pause only if the user
raises a concern.

---

## Phase 3 — Draft Body

Structure the body in this order. Imperative voice throughout ("Do X",
"Never Y" — not "the agent should X").

1. **`# H1` — Intent statement.** Two to four sentences: what the skill does,
   why it exists, what success looks like. This is the reasoning anchor — if
   the agent encounters a situation not covered by the steps, it reasons from
   this section.

2. **`## Values`** — Named priorities for genuine trade-offs. Omit if no
   meaningful value tension exists in this skill.

3. **`## Constraints`** — Hard stops before the open space. Keep short — if
   everything is constrained, nothing is trusted.

4. **`## Workflow`** or named phase sections — numbered steps stating *what*
   to do, not *how*, unless the how is non-obvious and has a single right
   answer. Delegate to agent judgment where reasonable.

5. **`## Output Format`** — what the agent produces: structure, format,
   required sections, file paths if relevant.

6. **`## Transitions`** — handoff to another skill, if applicable. State the
   skill name and condition. **Consider reusing an existing skill here:** if the
   skill needs complex behaviour (planning, evaluation, trust-auditing,
   quality review), reference a relevant existing skill by name rather than
   re-implementing — provided the target harness offers a skill-invocation
   mechanism. Where it does not, run the behaviour inline instead.

Keep under 500 lines and 5000 tokens.

**After drafting the body, determine the structural tier.**

Read `references/structural-tiers.md` to classify the skill. Determine:
- Which tier (1–4) the skill falls into
- What supporting files are needed (directory, filename, content summary)
- For each supporting file: whether its role is to be *run* (scripts/),
  *read* (references/), *adapted* (assets/), or *emulated* (examples/)

State the tier and the file plan. If the tier is 2+ and the supporting files
are clear from the elicitation context, proceed autonomously and note the
decision. Ask the user only if the tier decision is genuinely ambiguous.

---

## Phase 4 — Skill Audit Gate

Run an audit gate over the draft skill content (frontmatter + body) from
Phase 3, covering trust-calibration and routing-conflict checks. If the harness
provides a dedicated skill-audit skill, invoke it and pass the draft; otherwise
run the Phase 4 and Phase 5 fallbacks inline using their instructions below,
then continue to Phase 6.

When a skill-audit skill is used, parse its output for the presence of
`Creation Verdict:`. If that string is absent, the audit failed to complete —
run the Phase 4 (routing conflict check) and Phase 5 (trust-calibration pass)
fallbacks inline, then continue to Phase 6.

**Verdict handling:**
- `Creation Verdict: READY` or `Creation Verdict: READY (advisory)` — proceed
  to Phase 6.
- `Creation Verdict: NOT READY` — address every item in the Recommended
  Actions section. Revise the draft, then re-invoke skill-audit. Do not
  proceed to Phase 6 until the verdict is READY.

**External-repo note:** For skills being authored for an external repo
(established in Phase 1 Q6), the installed skill set at the target deployment
may differ from this repo. If skill-audit flags routing conflicts, check
whether they reflect the target environment rather than this repo — if so,
document the assumed deployment environment in the skill's `compatibility`
field.

---

## Phase 4 Fallback — Routing Conflict Check

*Run only if no skill-audit skill ran, or it did not return `Creation Verdict:`.*

1. Glob the harness's deployed-skills directory for all skill files (e.g.
   `~/.claude/skills/**/SKILL.md`, or wherever the target harness installs
   skills) to collect the installed skill set.
2. Read the `description` frontmatter field from each.
3. Identify phrases in the new skill's description that could plausibly match
   another skill's trigger. Use routing reasoning, not a syntactic formula.
4. For each candidate phrase, check whether it appears — verbatim or as a
   close paraphrase — in any existing skill's description.
5. For any match:
   - **Intentional** — the new skill names the conflicting skill in its
     negative triggers. No action needed.
   - **Ambiguous** — flag: the overlapping phrase, the conflicting skill name,
     and a proposed resolution.
6. If no conflicts found: "No routing conflicts detected."

Do not proceed to Phase 5 Fallback with unresolved ambiguous conflicts.

---

## Phase 5 Fallback — Trust-Calibration Pass

*Run only if no skill-audit skill ran, or it did not return `Creation Verdict:`.*

Run this rubric. Answer each question explicitly — do not summarise or skip.

**Q1 — Intent Clarity**
Read the H1 section only. If the skill's steps ended at step 2, could the
agent reason toward an acceptable outcome using only the intent statement?
Answer explicitly: what the intent enables and where it would leave the agent
uncertain.

**Q2 — Over-Specification Scan**
For each numbered step in the Workflow: is it specifying *what* or *how*?
Flag any step prescribing *how* when the agent could select an approach from
the *what* alone. Recommend loosening or converting to a value.

**Q3 — Gap Triage**
Identify every silence — places the skill doesn't cover a decision the agent
will face. For each gap, reason through: could an intelligent agent reach a
defensible outcome here? Could it go multiple reasonable ways? Or could it
not reliably reason to an acceptable outcome at all? Only the last case
requires an explicit addition.

**Q4 — Reasoning Surface**
Does the agent have what it needs to navigate novel situations? Check:
(a) clear intent statement, (b) trade-off values where relevant,
(c) hard constraints, (d) anchoring examples for subtle behaviours,
(e) escalation signal for out-of-scope situations.
Flag absent items that are genuinely needed — not all five are required.

**Q5 — Overall Calibration Verdict**
- `OVER-SPECIFIED` — loosen.
- `WELL-CALIBRATED` — proceed.
- `UNDER-SPECIFIED` — tighten.
- `MIXED` — list sections with corrective actions.

If not `WELL-CALIBRATED`, revise and re-run. Do not proceed to Phase 6 with
a failing verdict.

---

## Phase 6 — Conventions Check

| # | Convention | Check |
|---|---|---|
| 1 | Description uses `>` folding | Frontmatter description starts with `>` |
| 2 | Negative triggers present | Description contains "Do NOT trigger for" |
| 3 | H1 + H2 body structure | Body begins with `# ` and uses `## ` for sections |
| 4 | No generic supporting file names | No files named `reference.md`, `notes.md`, `data.md` |
| 5 | Imperative voice | Body uses "Do X" / "Never Y" — not "the agent should" |
| 6 | Constraints before freedom | `## Constraints` appears before `## Workflow` |

Fix all FAILs. If all pass: "All conventions pass."

---

## Phase 7 — Sentinel Gate

Run an adversarial sentinel gate over the complete skill draft (frontmatter +
body combined). If the harness provides a sentinel/gate-check skill (e.g.
creative-sentinel), invoke it with the framing below; otherwise apply the same
adversarial review inline and produce an equivalent verdict. Framing:

> "Gate-check this skill before it is written to disk. Treat the skill as the
> artefact under review. Assess: does this skill route correctly, trust the
> agent appropriately, and conform to conventions — and if deployed, could it
> cause routing failures, mechanical agent behaviour, or silent quality
> degradation across all skills built with it?"

Parse the verdict:
- `GATE: CLEARED` — proceed to Phase 8.
- `GATE: CONDITIONAL` — resolve conditions autonomously if unambiguous.
  Re-run the sentinel.
- `GATE: BLOCKED` — assess each blocker:
  - **Unambiguous** — what needs to change is clear from the blocker
    statement alone; resolve autonomously, re-run Phases 5–7.
    *Example: "The description exceeds 1024 characters" — shorten it.*
  - **Ambiguous** — resolving requires a decision only the user can make;
    surface the specific question, collect feedback, then re-run Phases 5–7.
    *Example: "The trigger overlaps with skills-audit — unclear which skill
    should own this case" — ask the user.*

Do not proceed to Phase 8 with an unresolved CONDITIONAL or BLOCKED verdict.

---

## Phase 8 — Write & Deploy

1. Present the complete skill output in one pass:
   - Final SKILL.md (frontmatter + body)
   - List of supporting files to be created, with target paths and content
     summaries
   - Target directory: `skills/<author>/<skill-name>/`

   This is the single user gate in this phase.

2. On explicit approval, branch on deployment context (established in Phase 1 Q6):

   **This repo (workflow-skills):**
   - Confirm the target path. Use `skills/<author>/<skill-name>/` for
     top-level skills. If the skill fits an existing category subdirectory
     (e.g. `meta-skills/`, `ai-model-tracking/`), confirm the path with
     the user before writing.
   - Create the skill directory if it does not exist
   - Write SKILL.md
   - Create any supporting file directories
   - Write all supporting files
   - Confirm all paths written

   **External repo:**
   - Confirm the target path with the user (the path in the external repo
     where the skill will live, e.g. `skills/<namespace>/<skill-name>/`).
   - Create the skill directory if it does not exist
   - Write SKILL.md and all supporting files to the confirmed path
   - Do NOT offer `just sync` for this repo
   - Confirm all paths written

3. **This repo only:** Offer `just sync` + `git commit` + `git push` as a
   single step. On acceptance, do all three. Continue doing so for subsequent
   skill commits in this session without asking again.

4. After the commit, ask the user:
   "What use case would you like an execution walk to test the skill for?"

   When the user responds, construct an execution-walk prompt using this template:

   > Walk [skill-name] from the agent's perspective. The agent has been
   > invoked via a phrase like "[most distinctive trigger phrase from description]".
   > The use case is: [user's answer]. Success looks like: [user's answer].
   > Walk the full skill and surface every gap visible only at execution time.

   Slot logic:
   - `[skill-name]` — frontmatter `name` field
   - `[most distinctive trigger phrase]` — first trigger phrase in the
     description that combines an action verb with a domain noun (not a
     generic opener like "use when")
   - `[user's answer]` — the literal answer, passed directly as both use case
     and success criterion; do not paraphrase

   Present the constructed prompt and offer:
   "You can run an execution walk with this prompt now. Want me to invoke it?"

   If yes and the harness provides a walt-walk (or equivalent execution-walk)
   skill, invoke it with the constructed prompt. If the harness has no such
   skill, hand the prompt to the user to run manually. If no, leave it for the
   user to run.
