import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { readLockfile, writeLockfile } from '../src/lockfile';
import type { Lockfile } from '../src/types';

describe('lockfile', () => {
  let tmpDir: string;
  let lockPath: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lockfile-test-'));
    lockPath = path.join(tmpDir, 'agent-skills.lock');
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  const sampleLockfile: Lockfile = {
    entries: [
      {
        sourcePath: '/home/user/.agent-skills/skills/my-skill.md',
        sourceHash: 'abc123',
        outputPath: '/project/.cursor/rules/my-skill.mdc',
        outputHash: 'def456',
        timestamp: '2026-03-11T00:00:00.000Z',
      },
    ],
  };

  it('write then read round-trip', async () => {
    await writeLockfile(lockPath, sampleLockfile);
    const result = await readLockfile(lockPath);

    expect(result).not.toBeNull();
    expect(result!.entries).toHaveLength(1);
    expect(result!.entries[0].sourcePath).toBe(sampleLockfile.entries[0].sourcePath);
    expect(result!.entries[0].sourceHash).toBe(sampleLockfile.entries[0].sourceHash);
    expect(result!.entries[0].outputPath).toBe(sampleLockfile.entries[0].outputPath);
    expect(result!.entries[0].outputHash).toBe(sampleLockfile.entries[0].outputHash);
    expect(result!.entries[0].timestamp).toBe(sampleLockfile.entries[0].timestamp);
  });

  it('returns null on missing file', async () => {
    const result = await readLockfile(path.join(tmpDir, 'nonexistent.lock'));
    expect(result).toBeNull();
  });

  it('writes stable key order', async () => {
    await writeLockfile(lockPath, sampleLockfile);
    const content = await fs.readFile(lockPath, 'utf-8');
    const keys = [...content.matchAll(/"(\w+)":/g)].map((m) => m[1]);

    // entries key first, then for each entry: sourcePath, sourceHash, outputPath, outputHash, timestamp
    expect(keys).toEqual([
      'entries',
      'sourcePath',
      'sourceHash',
      'outputPath',
      'outputHash',
      'timestamp',
    ]);
  });

  it('pretty-prints with 2-space indent', async () => {
    await writeLockfile(lockPath, sampleLockfile);
    const content = await fs.readFile(lockPath, 'utf-8');
    expect(content).toContain('  "entries"');
  });
});
