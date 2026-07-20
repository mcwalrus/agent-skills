# playwright-mcp steps

Exact tool calls for the Google sign-in workflow against
`playwright-mcp`. Unlike `chrome-devtools-mcp`, `playwright-mcp`
requires an **element ref** for `type` — so a snapshot must happen
*before* the first type call to capture the email field's ref.

## Variables

| Variable | Description | Example |
| --- | --- | --- |
| `{{EMAIL}}` | Google account email to sign in | `john.doe@example.com` |
| `{{EMAIL_REF}}` | Element ref for the email textbox, captured from the snapshot | `e10` |

The verification step at the end uses the `{{DISPLAY_NAME}}` and
`{{EMAIL}}` variables defined in the parent `SKILL.md`.

## Steps

### 1. Open the sign-in page

```js
playwright_browser_navigate({
  url: "https://accounts.google.com/ServiceLogin?service=accountsettings&continue=https%3A%2F%2Fmyaccount.google.com%2F"
})
```

### 2. Snapshot to find the email field ref

```js
playwright_browser_snapshot()
```

In the snapshot output, locate the email textbox. The accessible
name is typically `"Email or phone"`. Capture its `[ref=N]` token
and use it as `{{EMAIL_REF}}` in step 3. If the snapshot doesn't
show that exact name (Google occasionally varies it), look for any
textbox whose `role` is `textbox` and which sits above the
"Next" / password field — that's the email input.

### 3. Type the email

```js
playwright_browser_type({
  element: "Email or phone textbox",
  target: "{{EMAIL_REF}}",
  text: "{{EMAIL}}",
})
```

### 4. Submit

```js
playwright_browser_press_key({ key: "Enter" })
```

### 5. Hand off to the user

**Stop here.** Tell the user the password field is on their screen
and they should type the password themselves, hit Enter, then handle
any 2FA challenge. The agent must not type the password, TOTP code,
or any 2FA response. See the parent `SKILL.md` § "Safety boundary"
for the reasoning.

### 6. Verify

Navigate back to `myaccount.google.com` and take a snapshot:

```js
playwright_browser_navigate({ url: "https://myaccount.google.com/" })
playwright_browser_snapshot()
```

Check the success signals defined in the parent `SKILL.md`
§ "Workflow" step 6:

- Title is `Google Account`, not the signed-out landing
- H1 contains `{{DISPLAY_NAME}}`
- Static text under the H1 contains `{{EMAIL}}`
- URL stays at `https://myaccount.google.com/` (no redirect)
- Top-right banner button reads `Google Account: {{DISPLAY_NAME}} ({{EMAIL}})`

Any mismatch → repeat from step 1.