import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import matter from 'gray-matter';
import { runValidate } from './validate.js';
import { writeCursorRules } from '../adapters/cursor.js';
import { writeClaudeMd } from '../adapters/claude.js';
import { hashFile } from '../hasher.js';
import { writeLockfile } from '../lockfile.js';
import type { SourceFile, LockEntry } from '../types.js';

function toKebabCase(filename: string): string {
  return filename
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

async function readSourceFiles(baseDir: string): Promise<SourceFile[]> {
  const subdirs = ['skills', 'rules', 'suggestions'];
  const sources: SourceFile[] = [];

  for (const subdir of subdirs) {
    const dir = path.join(baseDir, subdir);
    let entries: string[] = [];
    try {
      entries = (await fs.readdir(dir)).filter((e) => e.endsWith('.md'));
    } catch {
      continue;
    }

    for (const entry of entries) {
      const filePath = path.join(dir, entry);
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      sources.push({
        path: filePath,
        type: data.type ?? 'skill',
        name: data.name ?? '',
        description: data.description ?? '',
        targets: data.targets ?? 'all',
        content,
      });
    }
  }

  return sources;
}

export async function runSync(cwd: string): Promise<void> {
  const { valid, errors } = await runValidate();

  if (!valid) {
    for (const err of errors) {
      console.error(`  ✗ ${err.file}: ${err.message}`);
    }
    throw new Error('Validation failed. Fix errors before syncing.');
  }

  const baseDir = path.join(os.homedir(), '.agent-skills');
  const sources = await readSourceFiles(baseDir);

  const cursorOutDir = path.join(cwd, '.cursor', 'rules');
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');

  const writtenMdc = await writeCursorRules(sources, cursorOutDir);
  await writeClaudeMd(sources, claudeMdPath);

  const claudeSources = sources.filter((s) => s.targets === 'claude' || s.targets === 'all');
  const claudeUpdated = claudeSources.length > 0;

  // Build lock entries
  const entries: LockEntry[] = [];

  // Cursor entries (one per .mdc file)
  for (const mdcPath of writtenMdc) {
    const basename = path.basename(mdcPath, '.mdc');
    const source = sources.find((s) => {
      const b = path.basename(s.path, path.extname(s.path));
      return toKebabCase(b) === basename;
    });

    if (!source) continue;

    const sourceHash = await hashFile(source.path);
    const outputHash = await hashFile(mdcPath);

    entries.push({
      sourcePath: source.path,
      sourceHash,
      outputPath: mdcPath,
      outputHash,
      timestamp: new Date().toISOString(),
    });
  }

  // Claude entries (one per claude-targeted source)
  for (const source of claudeSources) {
    const sourceHash = await hashFile(source.path);
    let outputHash = '';
    try {
      outputHash = await hashFile(claudeMdPath);
    } catch {
      outputHash = '';
    }

    entries.push({
      sourcePath: source.path,
      sourceHash,
      outputPath: claudeMdPath,
      outputHash,
      timestamp: new Date().toISOString(),
    });
  }

  const lockPath = path.join(cwd, 'agent-skills.lock');
  await writeLockfile(lockPath, { entries });

  console.log(`✓ Wrote ${writtenMdc.length} .mdc file(s) to ${cursorOutDir}`);
  console.log(`✓ CLAUDE.md ${claudeUpdated ? 'updated' : 'unchanged'}: ${claudeMdPath}`);
  console.log(`✓ Lockfile written: ${lockPath}`);
}
