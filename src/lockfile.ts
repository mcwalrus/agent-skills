import fs from 'fs/promises';
import type { Lockfile, LockEntry } from './types.js';

export async function readLockfile(filePath: string): Promise<Lockfile | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Lockfile;
  } catch {
    return null;
  }
}

export async function writeLockfile(filePath: string, data: Lockfile): Promise<void> {
  const ordered = {
    entries: data.entries.map((entry) => {
      const ordered: LockEntry = {
        sourcePath: entry.sourcePath,
        sourceHash: entry.sourceHash,
        outputPath: entry.outputPath,
        outputHash: entry.outputHash,
        timestamp: entry.timestamp,
      };
      return ordered;
    }),
  };
  await fs.writeFile(filePath, JSON.stringify(ordered, null, 2), 'utf-8');
}
