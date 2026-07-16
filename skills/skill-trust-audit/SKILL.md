---
name: skill-trust-audit
description: >
  Audit a skill, prompt, or agent instruction set against the values of trusted
  agent autonomy — determining what must be explicit, what can be safely delegated
  to agent reasoning, and where the skill over- or under-specifies. Use to evaluate
  whether a skill appropriately trusts an intelligent agent, assess gaps acceptable
  given agent reasoning capability, identify where discretion is removed, or
  establish a trust profile before deployment. Trigger on phrases like "trust audit",
  "audit this skill", "does this skill trust the agent", "where does this
  over-specify", "what gaps are acceptable", "is this skill too prescriptive",
  "agent autonomy review", "can the agent reason through this", or any request to
  evaluate a skill through the lens of intelligent agent delegation. Also trigger
  before deployment to determine whether gaps are risks or reasonable agent
  discretion. Do NOT trigger for general skill quality review — use creative-critic
  or creative-sentinel for that.
user-invocable: true
---

# Trust Audit

You are conducting a **trust audit**. The premise here is different from standard
critique: gaps in a skill are not automatically failures. An intelligent agent can
reason, infer, and make defensible decisions — and a skill that over-specifies
removes that capability, producing brittle, mechanical behaviour where judgment
would serve better.

The central question is not *"is this skill complete?"* but *"does this skill
appropriately trust the agent it is delegating to?"*

---

## The Trust Philosophy

Skills exist on a spectrum. At one extreme: exhaustive specification, every
decision pre-made, every edge case handled, the agent reduced to a parser. At the
other: pure intent with no grounding, the agent left to guess at outcomes that
matter. Neither extreme serves well.

The goal is **calibrated trust** — explicit where the stakes of misinterpretation
are high, delegated where agent reasoning is reliably sufficient.

An intelligent agent can:
- Infer intent from context and purpose
- Apply domain knowledge not present in the skill
- Make proportionate decisions when given values but not rules
- Recognise when to ask vs. when to proceed
- Reason toward defensible outcomes when the path isn't prescribed

A skill should lean on these capabilities — not around them.

---

## Trust Audit Framework

Work through these five lenses in order. Take notes as you go. At the end,
produce a Trust Profile.

### 1. Intent Clarity
Does the skill communicate *why* clearly enough for an agent to reason from
purpose when the instructions run out?

- Is the goal of the skill stated explicitly, or must it be inferred from the
  steps?
- If the agent encounters a situation not covered by the skill, does it have
  enough intent to navigate it?
- Would an intelligent agent reading this know what *success* looks like —
  not just what steps to follow?

**Trust signal:** A skill with clear intent but incomplete steps is often fine.
A skill with complete steps but unclear intent is fragile — the agent executes
correctly and still fails.

---

### 2. Over-Specification Scan
Where does the skill specify *how* when it should specify *what*?

Look for:
- Prescribed step sequences that could be reached multiple valid ways
- Explicit tool choices where the agent could select more appropriately given
  context
- Fixed formats or structures that constrain without adding value
- Rules that substitute for judgment the agent is capable of exercising

For each instance: *"If the agent deviated here based on context, would the
outcome be worse — or sometimes better?"*

**Trust signal:** Over-specification is waste at best, brittleness at worst.
Flag every place the skill is doing the agent's job for it unnecessarily.

---

### 3. Gap Assessment
Identify every gap — then evaluate each gap individually.

Not all gaps are equal. For each gap, apply the **Gap Triage**:

| Gap Type | Definition | Trust Verdict |
|---|---|---|
| **Acceptable gap** | An intelligent agent can reason to a defensible outcome; the outcome space of reasonable decisions is acceptable | Leave it — this is appropriate delegation |
| **Guidable gap** | Agent could go multiple ways; a value or principle (not a rule) would usefully orient the decision | Add a guiding value, not a prescription |
| **Dangerous gap** | Agent cannot reliably reason to an acceptable outcome; misinterpretation has meaningful consequences | Must be made explicit |

The distinction between *guidable* and *dangerous* is the key judgment call in
this audit. Apply the creative-critic instinct here — probe each gap with: *"In
the worst credible case, what does an agent do here, and what are the
consequences?"*

---

### 4. Reasoning Surface
Does the skill give the agent enough to reason *with* — not just instructions to
follow?

Check for:
- **Values** — does the skill communicate what matters? (speed vs. accuracy,
  brevity vs. completeness, safety vs. autonomy)
- **Constraints** — are boundaries stated, even if paths within them are free?
- **Examples** — where behaviour is subtle or context-dependent, does the skill
  provide at least one anchoring example?
- **Escalation signals** — does the agent know when a situation is outside the
  skill's scope and what to do then?

An agent equipped with values, constraints, and anchoring examples can navigate
novel situations. An agent with only steps cannot.

---

### 5. Trust Calibration Check
Step back and assess the overall posture of the skill.

- Is this skill written for the agent it will actually run on — capable of
  reasoning, inference, and judgment — or for a much simpler executor?
- Where has the author's anxiety about outcomes produced specification that
  constrains rather than guides?
- Where has the author's optimism about agent capability left genuine risks
  unaddressed?

Apply the creative-dreamer instinct briefly here: *"If this agent were fully
trusted — given the intent and the values and then left to execute — what would
it do? Is that acceptable?"* If yes, the specification in between may be
unnecessary.

---

## Trust Profile Output

Produce a Trust Profile with these sections:

### Intent Clarity Rating
`CLEAR` / `PARTIAL` / `UNCLEAR` — with one sentence of rationale.

### Over-Specification Findings
List each instance with: what is over-specified, what the agent could determine
for itself, and recommended action (remove / loosen / convert to value).

### Gap Register

| Gap | Type | Reasoning Path | Trust Verdict | Action |
|---|---|---|---|---|
| [description] | Acceptable / Guidable / Dangerous | [how agent would reason through it] | Trust / Guide / Specify | [none / add value / make explicit] |

### Reasoning Surface Assessment
What the agent has to work with (values, constraints, examples, escalation
signals) and what is missing.

### Overall Trust Calibration
One of:
- **OVER-SPECIFIED** — the skill constrains agent capability more than outcomes
  require. Loosen.
- **WELL-CALIBRATED** — the explicit/delegated balance is appropriate for the
  stakes and the agent.
- **UNDER-SPECIFIED** — dangerous gaps exist that agent reasoning cannot reliably
  bridge. Tighten.
- **MIXED** — some sections over-specify, others under-specify. Specific
  recommendations follow.

### Recommended Actions
Prioritised list — what to change, what to add, what to remove, in order of
impact on trust calibration.

---

## Closing Note

After completing the Trust Profile, if dangerous gaps or significant
over-specification have been found, consider passing the skill to
**creative-sentinel** for a gate-level review before deployment. The trust audit
finds the calibration issues; the sentinel determines whether they are blocking.

If the skill is well-calibrated or only has acceptable gaps, it is ready for
deployment. State this clearly — a skill that earns trust has earned confidence.
