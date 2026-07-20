---
name: google-signin-mcp
description: >
  Sign a Google account (Gmail, Workspace, any Google identity) into an MCP
  browser — chrome-devtools-mcp or playwright-mcp — so the agent can act on
  Google services as a specific user. Make sure to use this skill whenever
  the user mentions signing into Google via MCP, logging into Gmail or
  Workspace through the browser MCP, authenticating a Google account in
  chrome-devtools-mcp or playwright-mcp, or needs the MCP browser to act
  as a specific Google identity, even if they don't explicitly ask for a
  "sign-in". The agent types the email and verifies; the user types the
  password and handles 2FA. Do NOT use for OS-level Chrome profile sign-in
  or for non-Google services.
user-invocable: true
---

# Google Sign-In via MCP

Sign a specific Google account into the MCP browser so the agent can act
on Google services (Gmail, Drive, Calendar, Workspace, etc.) as that
user. The agent drives only the email step and verification — the user
handles the password and 2FA themselves.

## Why this exists

Both `chrome-devtools-mcp` and `playwright-mcp` spawn their own
**isolated browser instances** — they do not share cookies, sessions, or
profiles with the user's real Chrome. To act on Google as a specific
account, that account must be signed into the MCP's browser. The
sign-in flow is the same for any Google identity (personal Gmail,
Workspace, etc.); only the tool names differ between MCPs.

## Variables

| Variable | Description | Example |
| --- | --- | --- |
| `{{EMAIL}}` | Google account email to sign in | `john.doe@example.com` |
| `{{DISPLAY_NAME}}` | Expected display name shown after sign-in | `John Doe` |
| `{{MCP}}` | Which MCP to use | `chrome-devtools-mcp` or `playwright-mcp` |
| `{{EMAIL_REF}}` | (playwright-mcp only) element ref captured from the snapshot | `e10` |

## Pick an MCP

Choose whichever is available in the agent's tool list, in this order:

1. **`chrome-devtools-mcp`** — preferred. Types into the currently
   focused element with no ref required, so the workflow is shorter.
2. **`playwright-mcp`** — fallback. Requires a snapshot first to
   capture element refs before typing.

If neither MCP is connected, jump to [Boot MCP](#boot-mcp) below and
start the one you picked. Once it's in the tool list, proceed.

## Workflow

1. **Load the MCP-specific reference.** Read
   `references/{{MCP}}.md` for the exact tool calls. Do not invent tool
   names from memory — MCP tool APIs change.

2. **Navigate to the sign-in page.** The URL lands the user on
   `myaccount.google.com` after a successful sign-in, which gives you
   a single, consistent verification surface.

3. **Type `{{EMAIL}}` into the email field.**

4. **Submit** with Enter.

5. **STOP — hand off to the user.** Tell them the MCP browser is in
   front of them and they should type the password themselves, hit
   Enter, then handle whatever 2FA challenge comes next (Google
   prompt push, TOTP, security key, etc.). Do **not** type the
   password, TOTP code, or any 2FA response on the user's behalf —
   ever. See [Safety boundary](#safety-boundary).

6. **Verify.** Navigate to `https://myaccount.google.com/` and take a
   snapshot. A successful sign-in shows all of:

   - **Title:** `Google Account` (signed-in) — **not** `Learn More
     About Google's Secure and Protected Accounts` (signed-out
     landing)
   - **H1:** contains `{{DISPLAY_NAME}}`
   - **Static text under the H1:** contains `{{EMAIL}}`
   - **URL** stays at `https://myaccount.google.com/` with no
     redirect to a sign-in flow
   - **Top-right banner button:** reads `Google Account:
     {{DISPLAY_NAME}} ({{EMAIL}})` — the *absence* of this banner
     button is the cleanest single signal the session didn't land

   Any mismatch → repeat from step 2.

## Boot MCP

If the chosen `{{MCP}}` is **not** already visible in the agent's tool
list, you need to start it. MCPs spawn their own browser by default —
do not try to attach them to the user's existing Chrome state.

1. If an `.mcp.json` file (or other MCP config) already describes this
   server, **ask the user to configure the connection first** rather
   than spawning a second instance.

2. Otherwise, present the exact launch command and wait for the user
   to run it themselves in a separate terminal. The MCP will spawn
   its own browser.

   **chrome-devtools-mcp:**

   ```bash
   npx -y chrome-devtools-mcp@latest
   ```

   **playwright-mcp:**

   ```bash
   npx -y @playwright/mcp@latest
   ```

3. Once the user confirms the MCP is connected (visible in the
   tool list), return to [Workflow](#workflow) step 1.

## Safety boundary

The agent's only job in this skill is:

- Open the sign-in page
- Type the **email**
- Submit
- Verify

The user's job is everything in between and after:

- Type the **password**
- Complete any **2FA challenge** (Google prompt push, TOTP code,
  security key, Workspace-managed step-up, etc.)

This split exists for two reasons:

1. **The password and 2FA codes are secrets the user controls.** The
   agent must never see them typed, never paste them, and never log
   them. If the user asks the agent to type a password or 2FA code,
   refuse and remind them this boundary exists.

2. **The MCP browser is in front of the user.** Once the email is
   submitted, the password field is on their screen — they can type
   directly, hit Enter, and respond to any 2FA prompt without any
   agent mediation. Trying to automate this step usually makes it
   *less* secure and *more* brittle (TOTP codes expire, push prompts
   time out, etc.).

## Session lifecycle

- The Google session persists **for the lifetime of the MCP's
  browser process**. Killing the MCP (or its parent agent) discards
  the session — re-run this skill to sign in again.
- Each MCP has its own isolated browser. Signing into
  `chrome-devtools-mcp` does **not** sign into `playwright-mcp`, and
  neither touches the user's OS-level Chrome profile.
- The user's real Chrome is **untouched**. Extensions, cookies,
  bookmarks, and saved passwords from the real profile do **not**
  carry over; only the Google identity attaches.

## Limitations

- The MCP browser is separate from the user's real Chrome.
  Anything not signed in via this workflow (extensions, profile
  data, cookies for other services) won't be available.
- The agent cannot drive the password field or any 2FA challenge.
- Once the MCP restarts, the sign-in is lost.
- This skill is **Google-specific**. Non-Google services that use
  Google as an identity provider (some SSO flows, third-party
  "Sign in with Google" buttons) follow a different shape and aren't
  covered here.

## Reference files

| File | Purpose |
| --- | --- |
| `references/chrome-devtools-mcp.md` | Exact tool calls for `chrome-devtools-mcp` |
| `references/playwright-mcp.md` | Exact tool calls for `playwright-mcp`, including the snapshot-for-ref pattern |