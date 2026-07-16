# Claude Code Monitors Guide

Monitors are persistent background processes that Claude Code starts automatically when a plugin is active. Each monitor runs a shell command for the lifetime of the session and delivers every stdout line to Claude as a notification — so Claude can react to log entries, status changes, or polled events without being asked to start the watch itself.

Source: https://code.claude.com/docs/en/plugins-reference (fetched 2026-04-18)

**Availability:** Claude Code v2.1.105+, interactive CLI sessions only. Not available on Bedrock, Vertex AI, or Microsoft Foundry. Skipped if the Monitor tool is unavailable on the host.

---

## File Location

Monitors are declared in one of two ways:

- **Dedicated file:** `monitors/monitors.json` in the plugin root — a JSON array of monitor entries
- **Inline in `plugin.json`:** set the `monitors` key to the same array

Both produce the same behaviour. Use `monitors/monitors.json` when you have more than two monitors; inline when you want a single file for a simple plugin.

The default location is `monitors/monitors.json`. To load from a non-default path, set `monitors` to a relative path string in `plugin.json` (e.g. `"monitors": "./config/monitors.json"`).

---

## Monitor Schema

Each monitor is a JSON object with these fields.

### Required fields

| Field | Type | Description |
|---|---|---|
| `name` | string | Identifier unique within the plugin. Prevents duplicate processes when the plugin reloads or a skill is invoked again. |
| `command` | string | Shell command run as a persistent background process in the session working directory. |
| `description` | string | Short summary of what is being watched. Shown in the task panel and in notification summaries. |

### Optional fields

| Field | Type | Description |
|---|---|---|
| `when` | string | Controls when the monitor starts. `"always"` (default) starts at session start and on plugin reload. `"on-skill-invoke:<skill-name>"` starts the first time the named skill in this plugin is dispatched. |

---

## Variable Substitution

The `command` field supports variable substitutions:

| Variable | Value |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}` | Absolute path to the plugin's installation directory |
| `${CLAUDE_PLUGIN_DATA}` | Persistent directory for plugin state, survives updates |
| `${user_config.KEY}` | User-configured value set at plugin enable time (non-sensitive values only) |
| `${ENV_VAR}` | Any environment variable present in the session |

**Shell injection risk:** If `${user_config.*}` values are used in a command, always double-quote the substitution:
```json
"command": "curl -s \"${user_config.api_endpoint}/status\""
```
An unquoted `${user_config.api_endpoint}` containing spaces or shell metacharacters will break or hijack the command.

---

## Security Rules

1. **Commands run unsandboxed at hook trust level.** A monitor command has the same permissions as the Claude Code process. Treat it with the same care as a hook script.

2. **Write read-only commands only.** Monitors should observe — they should not write to shared state, install packages, or mutate files. Stick to: `tail -F`, polling scripts that read and print, `curl` GET requests.

3. **No secrets in the command string.** Do not hardcode API keys or passwords. Use `${user_config.KEY}` with `"sensitive": true` in the plugin's `userConfig` so the value goes to the keychain.

4. **Disabling mid-session does not stop running monitors.** If you disable a plugin during a session, its monitors keep running until the session ends.

5. **Long-lived processes only.** The command should run indefinitely (a tail, a polling loop, a server). Short-lived commands that exit immediately produce a single notification and no further output.

---

## Working Examples

### 1. Watch an application error log

```json
[
  {
    "name": "error-log",
    "command": "tail -F ./logs/error.log",
    "description": "Application error log — new lines delivered to Claude as notifications"
  }
]
```

### 2. Poll a deployment status endpoint

```json
[
  {
    "name": "deploy-status",
    "command": "${CLAUDE_PLUGIN_ROOT}/scripts/poll-deploy.sh \"${user_config.api_endpoint}\"",
    "description": "Poll deployment status every 10s and notify Claude of changes"
  }
]
```

The polling script prints a line each time status changes; Claude sees each line as a notification.

### 3. Start only when a skill is invoked

```json
[
  {
    "name": "debug-log-watcher",
    "command": "tail -F ./logs/debug.log",
    "description": "Watch debug log — starts only when the debug skill is dispatched",
    "when": "on-skill-invoke:debug"
  }
]
```

`on-skill-invoke:debug` means the monitor starts the first time the `debug` skill in this plugin is run. Useful for monitors that are only relevant during specific workflows.

---

## plugin.json Integration

To declare monitors inline in `plugin.json`:

```json
{
  "name": "my-plugin",
  "monitors": [
    {
      "name": "error-log",
      "command": "tail -F ./logs/error.log",
      "description": "Application error log"
    }
  ]
}
```

Or reference the file:

```json
{
  "name": "my-plugin",
  "monitors": "./monitors/monitors.json"
}
```
