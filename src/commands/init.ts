import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const BASE_DIR = path.join(os.homedir(), '.agent-skills');
const SUBDIRS = ['skills', 'rules', 'suggestions'];
const DEFAULT_CONFIG = { version: 1, targets: ['cursor', 'claude'] };

export async function runInit(options: { guide?: boolean; force?: boolean } = {}): Promise<void> {
  try {
    await fs.mkdir(BASE_DIR, { recursive: true });
    console.log(`✓ Created ${BASE_DIR}`);

    for (const subdir of SUBDIRS) {
      const subdirPath = path.join(BASE_DIR, subdir);
      await fs.mkdir(subdirPath, { recursive: true });
      console.log(`✓ Created ${subdirPath}`);
    }

    const configPath = path.join(BASE_DIR, 'config.json');
    let configExists = false;
    try {
      await fs.access(configPath);
      configExists = true;
    } catch {
      configExists = false;
    }

    if (!configExists || options.force) {
      await fs.writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + '\n', 'utf-8');
      console.log(`✓ Created ${configPath}`);
    } else {
      console.log(`  Skipped ${configPath} (already exists, use --force to overwrite)`);
    }

    if (options.guide) {
      const guidePath = path.join(BASE_DIR, 'GUIDE.md');
      let guideExists = false;
      try {
        await fs.access(guidePath);
        guideExists = true;
      } catch {
        guideExists = false;
      }

      if (!guideExists || options.force) {
        await fs.writeFile(guidePath, GUIDE_CONTENT, 'utf-8');
        console.log(`✓ Created ${guidePath}`);
      } else {
        console.log(`  Skipped ${guidePath} (already exists, use --force to overwrite)`);
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to initialize agent-skills directory: ${err.message}`);
    }
    throw err;
  }
}

const GUIDE_CONTENT = `# agent-skills Guide

## Skills vs Rules vs Suggestions

- **skills/**: Reusable coding patterns or techniques that agents should apply when relevant.
  - Example: "Always use early returns to reduce nesting"
- **rules/**: Hard constraints that agents must always follow.
  - Example: "Never commit secrets or API keys"
- **suggestions/**: Optional hints that improve output quality but are not mandatory.
  - Example: "Prefer descriptive variable names over single-letter names"

## Source File Format

Source files are Markdown with YAML frontmatter.

**Required frontmatter fields:**
- \`type\`: One of \`skill\`, \`rule\`, or \`suggestion\`
- \`name\`: Human-readable name for the skill/rule/suggestion
- \`description\`: Brief description (used in Cursor .mdc frontmatter)
- \`targets\`: One of \`cursor\`, \`claude\`, or \`all\`

**Example source file (\`skills/early-returns.md\`):**

\`\`\`markdown
---
type: skill
name: Early Returns
description: Use early returns to reduce nesting and improve readability
targets: all
---

## Early Returns

Prefer early returns over deeply nested if-else blocks.

**Good:**
\`\`\`js
function process(value) {
  if (!value) return null;
  return transform(value);
}
\`\`\`

**Bad:**
\`\`\`js
function process(value) {
  if (value) {
    return transform(value);
  } else {
    return null;
  }
}
\`\`\`
\`\`\`

## Cursor .mdc Output Format

Files targeting Cursor are written to \`.cursor/rules/\` as \`.mdc\` files.

Each file has YAML frontmatter with:
- \`description\`: From the source frontmatter
- \`alwaysApply: true\`

Followed by the source Markdown body unchanged.

**Example output (\`.cursor/rules/early-returns.mdc\`):**

\`\`\`markdown
---
description: Use early returns to reduce nesting and improve readability
alwaysApply: true
---

## Early Returns

Prefer early returns over deeply nested if-else blocks.
...
\`\`\`

## Claude Code CLAUDE.md Output Format

Files targeting Claude are merged into \`CLAUDE.md\` using HTML comment delimiters.

Each section is wrapped with:
- \`<!-- agent-skills:start:<slug> -->\`
- \`<!-- agent-skills:end:<slug> -->\`

Where \`<slug>\` is the kebab-case filename (without extension).

Re-running \`agent-skills sync\` replaces only the delimited sections; all manually written content outside the delimiters is preserved.

**Example output in \`CLAUDE.md\`:**

\`\`\`markdown
# My Project

This is my custom CLAUDE.md content.

<!-- agent-skills:start:early-returns -->
## Early Returns

Prefer early returns over deeply nested if-else blocks.
...
<!-- agent-skills:end:early-returns -->

More custom content here.
\`\`\`
`;
