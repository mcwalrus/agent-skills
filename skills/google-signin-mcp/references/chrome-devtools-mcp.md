# chrome-devtools-mcp steps

Exact tool calls for the Google sign-in workflow against
`chrome-devtools-mcp`. The key advantage of this MCP is that
`chrome_devtools_type_text` writes into the currently focused
element — no snapshot, no element ref, no ID resolution.

## Variables

| Variable | Description | Example |
| --- | --- | --- |
| `{{EMAIL}}` | Google account email to sign in | `john.doe@example.com` |

The verification step at the end uses the `{{DISPLAY_NAME}}` and
`{{EMAIL}}` variables defined in the parent `SKILL.md`.

## Steps

### 1. Open the sign-in page

```js
chrome_devtools_navigate_page({
  type: "url",
  url: "https://accounts.google.com/ServiceLogin?service=accountsettings&continue=https%3A%2F%2Fmyaccount.google.com%2F"
})
```

### 2. Type the email

The email field is focused by default after the page loads, so
`chrome_devtools_type_text` writes into it directly:

```js
chrome_devtools_type_text({ text: "{{EMAIL}}" })
```

### 3. Submit

```js
chrome_devtools_press_key({ key: "Enter" })
```

### 4. Hand off to the user

**Stop here.** Tell the user the password field is on their screen
and they should type the password themselves, hit Enter, then handle
any 2FA challenge. The agent must not type the password, TOTP code,
or any 2FA response. See the parent `SKILL.md` § "Safety boundary"
for the reasoning.

### 5. Verify

Navigate back to `myaccount.google.com` and take a snapshot:

```js
chrome_devtools_navigate_page({ type: "url", url: "https://myaccount.google.com/" })
chrome_devtools_take_snapshot()
```

Check the success signals defined in the parent `SKILL.md`
§ "Workflow" step 6:

- Title is `Google Account`, not the signed-out landing
- H1 contains `{{DISPLAY_NAME}}`
- Static text under the H1 contains `{{EMAIL}}`
- URL stays at `https://myaccount.google.com/` (no redirect)
- Top-right banner button reads `Google Account: {{DISPLAY_NAME}} ({{EMAIL}})`

Any mismatch → repeat from step 1.