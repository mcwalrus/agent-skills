#!/usr/bin/env node
import { Command } from 'commander';
import { runInit } from './commands/init.js';
import { runSync } from './commands/sync.js';
import { runCheck } from './commands/check.js';
import { runValidate } from './commands/validate.js';
import { runHelp } from './commands/help.js';

const program = new Command();

program
  .name('agent-skills')
  .description('Sync agent skills/rules/suggestions to Cursor and Claude Code')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize ~/.agent-skills/ directory with config and subdirectories')
  .option('--guide', 'Write GUIDE.md with format reference')
  .option('--force', 'Overwrite existing config/GUIDE.md')
  .action(async (options: { guide?: boolean; force?: boolean }) => {
    await runInit(options);
  });

program
  .command('sync')
  .description('Validate source files and write all output files')
  .action(async () => {
    await runSync(process.cwd());
  });

program
  .command('check')
  .description('Compare current file hashes against agent-skills.lock (for CI)')
  .action(async () => {
    const { inSync } = await runCheck(process.cwd());
    if (!inSync) {
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Check source files for frontmatter format errors')
  .action(async () => {
    const { valid } = await runValidate();
    if (!valid) {
      process.exit(1);
    }
  });

program
  .command('help [command]')
  .description('Print command documentation')
  .action((command?: string) => {
    runHelp(command);
  });

program.parse(process.argv);
