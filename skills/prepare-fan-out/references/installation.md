
# Install harness

I use pi.dev as my harness. Connected to my harness, I use:

```codebase-design
pi install -l npm:pi-subagents
pi install -l npm:context-mode
pi install -l npm:@dietrichgebert/ponytail
pi install -l npm:@narumitw/pi-goal
```

Set npm:@dietrichgebert/ponytail in lite mode.

This needs configuration too.

Include install of [https://github.com/mattpocock/skills](https://github.com/mattpocock/skills/tree/main/skills/engineering) for the pi harness:

```bash
npx skills@latest add mattpocock/skills --skill code-review -a pi -y
npx skills@latest add mattpocock/skills --skill codebase-design -a pi -y
npx skills@latest add mattpocock/skills --skill resolving-merge-conflicts -a pi -y
npx skills@latest add mattpocock/skills --skill handoff -a pi -y
npx skills@latest add mattpocock/skills --skill implement -a pi -y
npx skills@latest add mattpocock/skills --skill prototype -a pi -y
npx skills@latest add mattpocock/skills --skill tdd -a pi -y
```
