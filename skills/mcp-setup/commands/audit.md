# MCP Setup Audit

Read-only review of installed plugins, MCP servers, and monitor configurations.
This command audits only — it makes no writes, installs, or removals.

---

## Graceful Skip

Check whether the `claude` CLI is on PATH:

```bash
command -v claude
```

If the command returns nothing (exit code non-zero), output:

> `claude` CLI not found on PATH — skipping MCP setup audit.

Then stop. Do not run any remaining sections.

---

## Plugin Inventory

```bash
claude plugin list --json
```

Handle each outcome:

- **Command fails or produces no output:** Note "plugin list command failed — skipping plugin inventory" and continue to MCP Inventory.
- **Output is not parseable JSON:** Note "plugin list output is not valid JSON — skipping plugin inventory" and continue to MCP Inventory.
- **JSON array is empty (`[]`):** Note "No plugins installed" and continue to MCP Inventory.
- **JSON array is non-empty:** Present a table with columns: `id` and `enabled`.

After presenting the plugin table, ask:

> "Are there any plugins you'd like to remove?"

Record the response. Do not act on removals — provide the removal command in the Audit Summary.

---

## MCP Inventory

```bash
claude mcp list
```

Present the raw output verbatim. "No MCP servers configured" is a valid state — record it as-is.

After presenting, ask:

> "Are there any MCP servers you'd like to remove?"

Record the response. Do not act on removals — provide the removal command in the Audit Summary.

---

## Monitor Review

Check for monitor configuration files:

```bash
ls monitors/monitors.json 2>/dev/null
ls .claude-plugin/plugin.json 2>/dev/null
```

Handle each outcome:

- **Neither file found:** State "No monitors configured" and continue to Audit Summary.
- **One or both found:** For each file found, load `references/monitors-guide.md` and surface the `name`, `command`, and `description` fields for each monitor defined in the file.

Apply the Security Rules from `references/monitors-guide.md`. Flag only:
- Hardcoded credentials (literal API keys, tokens, or passwords in the config)
- Unquoted `${user_config.*}` references

Do not flag anything else. If neither issue is present in any monitor, note "No security issues detected in monitor configs."

After presenting, ask:

> "Are there any monitors you'd like to revise?"

Record the response. Do not act on revisions — note required edits in the Audit Summary.

---

## Audit Summary

List every flagged item from the sections above. If nothing was flagged and no removals were requested, state:

> No issues found. All installed plugins, MCP servers, and monitors look clean.

If removals or revisions were requested, provide the exact commands the user should run:

| Action | Command |
|---|---|
| Remove a plugin | `claude plugin uninstall <id>` |
| Remove an MCP server | `claude mcp remove <name>` |
| Revise a monitor | Edit the config file directly: `monitors/monitors.json` or `.claude-plugin/plugin.json` |

Confirm that nothing was removed or written during this audit.

---

## Next Steps

If no issues were found: the environment is in a clean state.

If issues were flagged: copy the removal commands above and run them when ready. For monitor
revisions, open the config file, apply the change, and re-run `/mcp-setup audit` to confirm.
