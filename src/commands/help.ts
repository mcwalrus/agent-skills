const COMMANDS: Record<string, { description: string; flags: string; example: string; details: string }> = {
  init: {
    description: 'Initialize ~/.agent-skills/ directory with config and subdirectories',
    flags: '--guide  Write GUIDE.md with format reference\n  --force  Overwrite existing config/GUIDE.md',
    example: 'agent-skills init --guide',
    details: `  agent-skills init [--guide] [--force]

  Creates ~/.agent-skills/ with skills/, rules/, suggestions/ subdirectories
  and a config.json file.

  Flags:
    --guide   Also write GUIDE.md documenting the source file format and output formats
    --force   Overwrite existing config.json and GUIDE.md if they already exist

  Example:
    agent-skills init --guide`,
  },
  sync: {
    description: 'Validate source files and write all output files (.mdc, CLAUDE.md, lockfile)',
    flags: '(none)',
    example: 'agent-skills sync',
    details: `  agent-skills sync

  Validates all source files in ~/.agent-skills/, then writes:
    - .cursor/rules/*.mdc files for Cursor
    - CLAUDE.md sections for Claude Code
    - agent-skills.lock in the current working directory

  Example:
    agent-skills sync`,
  },
  check: {
    description: 'Compare current file hashes against agent-skills.lock (for CI)',
    flags: '(none)',
    example: 'agent-skills check',
    details: `  agent-skills check

  Reads agent-skills.lock and re-hashes all source and output files.
  Exits with code 0 if all files are in sync, code 1 if any are out of sync.

  Diff reasons:
    source-changed   Source file was modified since last sync
    output-missing   Output file was deleted
    output-modified  Output file was modified manually

  CI usage example:
    # In .github/workflows/ci.yml
    - run: npx agent-skills check`,
  },
  validate: {
    description: 'Check source files for frontmatter format errors',
    flags: '(none)',
    example: 'agent-skills validate',
    details: `  agent-skills validate

  Reads all .md files from ~/.agent-skills/ and checks for:
    - Unknown frontmatter keys
    - Invalid type values (must be: skill | rule | suggestion)
    - Invalid targets values (must be: cursor | claude | all)
    - Missing targets field (warning only)
    - Empty file body

  Example:
    agent-skills validate`,
  },
  help: {
    description: 'Print command documentation',
    flags: '[command]  Show detailed help for a specific command',
    example: 'agent-skills help sync',
    details: `  agent-skills help [command]

  With no argument: prints usage summary for all commands.
  With a command name: prints detailed help for that command.

  Example:
    agent-skills help init`,
  },
};

const VALID_COMMANDS = Object.keys(COMMANDS);

export function runHelp(command?: string): void {
  if (!command) {
    console.log('Usage: agent-skills <command> [options]\n');
    console.log('Commands:\n');
    for (const [name, info] of Object.entries(COMMANDS)) {
      console.log(`  ${name.padEnd(12)} ${info.description}`);
      console.log(`               Flags: ${info.flags}`);
      console.log(`               Example: ${info.example}\n`);
    }
    return;
  }

  const info = COMMANDS[command];
  if (!info) {
    console.error(`Unknown command: "${command}". Valid commands: ${VALID_COMMANDS.join(', ')}`);
    return;
  }

  console.log(info.details);
}
