# Monitor Setup

Walk the user through adding Claude Code monitors to their plugin. Monitors are persistent background shell commands that feed stdout to Claude as notifications — they observe the environment passively, they do not intercept or block actions.

---

## Security Checklist

Before doing anything else, confirm these rules are active for this walkthrough:

- **Monitors run unsandboxed at hook trust level.** A monitor command has the same permissions as the Claude Code process — treat it as carefully as a hook script.
- **Read-only commands only.** Monitors must observe, not mutate. Acceptable: `tail -F`, polling scripts, GET requests. Not acceptable: installers, file mutations, network writes.
- **Present the full config before writing.** Show the complete `monitors.json` (or `plugin.json`) as it will be written. Wait for explicit confirmation before writing anything.
- **No secrets in command strings.** Use `${user_config.KEY}` with `sensitive: true` for any credential — never hardcode an API key or token.

Load `references/monitors-guide.md` now. Keep it loaded for the rest of this walkthrough.

---

## Step 1: Version Check

Monitors require Claude Code v2.1.105 or later. Check:

```bash
claude --version
```

If the version is below v2.1.105, say: "Your Claude Code version does not support monitors. Update with `npm install -g @anthropic-ai/claude-code` and re-run this walkthrough."

---

## Step 2: Plugin Directory Check

Monitors must be declared inside a plugin. Check which structure is present:

```bash
ls .claude-plugin/plugin.json 2>/dev/null && echo "plugin.json found" || echo "not found"
ls monitors/monitors.json 2>/dev/null && echo "monitors.json found" || echo "not found"
```

**Routing:**

- `.claude-plugin/plugin.json` found → monitors can be declared inline under the `monitors` key, or in a separate `monitors/monitors.json` file referenced from it. Prefer the separate file if more than two monitors are planned.
- Neither found → stop. Say:

> "No plugin directory found. Monitors must be declared inside a Claude Code plugin. Create `.claude-plugin/plugin.json` first — the plugin can be minimal (just a `name` field). Would you like help creating one?"

Do not proceed past this point without a confirmed plugin context.

---

## Step 3: What to Watch

Present the three working patterns from `references/monitors-guide.md`:

1. **Error log watcher** — `tail -F ./logs/error.log` — delivers each new log line to Claude as a notification. Use when you want Claude to react to application errors.
2. **Polling script** — a script that polls an endpoint every N seconds and prints status changes. Use for CI, deploy status, or external service health.
3. **On-invoke watcher** — same as above, but starts only when a specific skill is dispatched (`when: "on-skill-invoke:<name>"`). Use for monitors that are only relevant during a specific workflow.

Say: "Which of these fits what you want to observe, or describe what you want to watch and I will draft a monitor for it."

Wait for the user to respond before continuing.

---

## Step 4: Draft the Monitor

Based on the user's choice or description, draft the monitor object using the schema from `references/monitors-guide.md`:

```json
{
  "name": "<kebab-case-name>",
  "command": "<shell command that runs indefinitely and prints to stdout>",
  "description": "<one sentence: what is being watched>"
}
```

Add `"when": "on-skill-invoke:<skill-name>"` only if the user wants the monitor to start conditionally.

**Variable substitution check:** If the command uses `${user_config.*}`, confirm the user config key is declared in `plugin.json` under `userConfig`. Double-quote the substitution in the command string.

**Long-lived check:** Confirm the command runs indefinitely. A command that exits immediately will emit one notification and stop. If the user's script is short-lived, suggest wrapping it:
```bash
while true; do your-command; sleep 10; done
```

---

## Step 5: Present Full Config for Confirmation

Show the complete file as it will be written — not just the new monitor entry, but the entire file content.

**If writing `monitors/monitors.json`:**
```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log — new lines delivered to Claude as notifications"
  }
]
```

**If writing inline in `plugin.json`:**
Show the full `plugin.json` with the `monitors` key added.

Say: "Here is the full file as it will be written. Does this look correct? I will not write anything until you confirm."

Wait for explicit confirmation before proceeding.

---

## Step 6: Write or Update the Config

After confirmation:

**Preferred — `monitors/monitors.json`:**

- Create `monitors/` directory if absent.
- If the file does not exist: create it with the proposed array.
- If it exists: read it, add the new entry to the array, write the merged result. Show the merged file before writing.
- Ensure `plugin.json` references the file if not already: add `"monitors": "./monitors/monitors.json"` to `plugin.json`.

**Inline in `plugin.json` (for one or two monitors):**

- Read the current `plugin.json`, add or append to the `monitors` array, write the result.

---

## Step 7: Verification Close

Load `references/verification.md` and present the Monitor Verification section.

Then say: "Restart Claude Code for the monitor to take effect. On the next session, the monitor will start automatically and Claude will receive its stdout lines as notifications."

Ask: "Would you like to add another monitor, or are you done?"
