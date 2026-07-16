---
name: regret-register
description: >
  Structure and persist project regrets and learnings as beads issues so
  they survive session end and are queryable by label. Use when the user says
  "log this regret", "add this to the regret register", "store this learning",
  "remember this for next time", "record that we should have done X", or
  invokes /regret-register. Do NOT trigger for retrospective analysis or
  future-self review — use future-max for that. Do NOT trigger for
  free-form persistent notes — use bd remember for that.
user-invocable: true
---

# Regret Register

Structure and persist project regrets and learnings as beads issues. A
regret entry is a durable, queryable record — not a session note. Success
means the learning survives session end and can be retrieved with
`bd list --label regret` or `bd list --label learning` in any future session.

## Constraints

- Apply the durability filter before creating any entry. If the regret doesn't
  pass all required criteria, tell the user why and stop.
- Never create an entry without at least: title, what happened, root cause,
  and prevention.
- Infer all fields aggressively from context. Collect all missing-field
  questions into a single message — never ask one at a time.
- Do not store consciously accepted trade-offs. Those are decisions, not regrets.
- Do not use `bd remember` for regrets — that is free-form and not queryable
  by structured label. Regrets are beads issues.

## Durability Filter

A regret must pass **all three required criteria** plus **at least one
qualifying criterion**.

**Required (all must be true):**
1. The prevention step is concrete — "be more careful" fails; "check X before
   starting Y" passes
2. It was non-obvious — something a reasonable agent would miss without prior
   experience with this failure mode
3. It is general enough to apply beyond the current file or component

**Qualifying (at least one must be true):**
- Reveals a missing feedback layer: no automated signal, no verification gate,
  no check that would have caught it earlier
- Involves a decision that looked correct at the time but proved wrong in
  practice — not carelessness, a genuine misjudgment

**Hard disqualifiers (any one skips the entry):**
- Already captured in code, tests, types, or docs — skip only if you can point
  to the specific file or line that contains this learning
- One-off error unlikely to recur (typo, misread requirement, copy-paste)
- Prevention is "be more careful" or equivalent non-action
- Known trade-off consciously accepted — not a regret, a decision

If a regret fails the filter, say: `Skipped: [one sentence reason]`. Do not
create the entry.

## Workflow

1. **Verify beads.** Run `bd status`. If it errors with "no beads database
   found", tell the user to run `bd init` first and stop.

2. **Extract the regret.** Read the learning from conversation context, user
   statement, or session notes. If the user provided full content, jump to 4.

3. **Apply the durability filter.** Fail fast — if any hard disqualifier
   applies or the required criteria aren't met, stop here.

4. **Fill the entry fields.** Infer What happened, Root cause, and Missing
   signal from conversation context. Ask only for fields the conversation
   doesn't provide — typically Context and Generalizes to — in a single
   message. (See Entry Format below for field definitions.)

5. **Choose the beads type:**
   - `bd create --type decision` — for learnings that should inform future
     architecture or approach (how to start, structure, or scope similar work)
   - `bd create --type task` — for regrets that require concrete follow-up
     action in this project
   If the regret is both an architectural learning and requires a follow-up
   action, prefer `decision` and note the action in the Prevention field.

6. **Create the issue.** Use `--title` for the 3–6 word regret name. Write
   the six-field body as `--description`. Check labels exist first with
   `bd label list`; if not, create with `bd label create regret`. Then:
   ```
   bd create --type decision \
     --title "short regret name" \
     --description "**What happened:** ...
   **Root cause:** ...
   **Missing signal:** ...
   **Prevention:** ...
   **Context:** ...
   **Generalizes to:** ..." \
     --labels regret
   ```

7. **Confirm.** Output: `Stored: [regret name] → [entry ID]`

## Entry Format

Pass all six fields in `--description`:

```
**What happened:** [one sentence — the outcome]
**Root cause:** [what decision or gap caused it]
**Missing signal:** [what feedback would have caught it earlier]
**Prevention:** [concrete action: "do X before Y", "check Z first"]
**Context:** [project, date, scope]
**Generalizes to:** [one sentence on where else this applies]
```

## Batch Mode

When multiple regrets arrive at once: verify beads once, then run each
through the durability filter, collect all missing-field questions into a
single pass, and create all passing entries in sequence.

Report each result on its own line:
- `Stored: [regret name] → [entry ID]`
- `Skipped: [reason — one sentence]`
