import path from 'path';
import { readLockfile } from '../lockfile.js';
import { hashFile } from '../hasher.js';

export interface SyncDiff {
  file: string;
  reason: 'source-changed' | 'output-missing' | 'output-modified';
}

export async function runCheck(cwd: string): Promise<{ inSync: boolean; diffs: SyncDiff[] }> {
  const lockPath = path.join(cwd, 'agent-skills.lock');
  const lockfile = await readLockfile(lockPath);

  if (!lockfile) {
    console.log('No agent-skills.lock found. Run `agent-skills sync` first.');
    return { inSync: false, diffs: [] };
  }

  const diffs: SyncDiff[] = [];

  for (const entry of lockfile.entries) {
    // Check if source changed
    let currentSourceHash: string;
    try {
      currentSourceHash = await hashFile(entry.sourcePath);
    } catch {
      // Source file missing — treat as source-changed
      diffs.push({ file: entry.sourcePath, reason: 'source-changed' });
      continue;
    }

    if (currentSourceHash !== entry.sourceHash) {
      diffs.push({ file: entry.sourcePath, reason: 'source-changed' });
    }

    // Check output file
    let currentOutputHash: string;
    try {
      currentOutputHash = await hashFile(entry.outputPath);
    } catch {
      diffs.push({ file: entry.outputPath, reason: 'output-missing' });
      continue;
    }

    if (currentOutputHash !== entry.outputHash) {
      diffs.push({ file: entry.outputPath, reason: 'output-modified' });
    }
  }

  const inSync = diffs.length === 0;

  if (inSync) {
    console.log('All files are in sync.');
  } else {
    for (const diff of diffs) {
      console.log(`  ✗ ${diff.file}: ${diff.reason}`);
    }
  }

  return { inSync, diffs };
}
