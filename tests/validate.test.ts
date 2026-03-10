import { hashString } from '../src/hasher';
import { runValidate } from '../src/commands/validate';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

describe('hashString', () => {
  it('produces consistent output for the same input', () => {
    const hash1 = hashString('hello world');
    const hash2 = hashString('hello world');
    expect(hash1).toBe(hash2);
  });

  it('produces different output for different inputs', () => {
    const hash1 = hashString('hello');
    const hash2 = hashString('world');
    expect(hash1).not.toBe(hash2);
  });

  it('returns a 64-character hex string (SHA-256)', () => {
    const hash = hashString('test content');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('runValidate', () => {
  const baseDir = path.join(os.homedir(), '.agent-skills');
  const skillsDir = path.join(baseDir, 'skills');

  async function writeTestFile(filename: string, content: string) {
    await fs.mkdir(skillsDir, { recursive: true });
    await fs.writeFile(path.join(skillsDir, filename), content, 'utf-8');
  }

  async function removeTestFile(filename: string) {
    try {
      await fs.unlink(path.join(skillsDir, filename));
    } catch {
      // ignore
    }
  }

  it('returns valid: true and no real errors for a valid file', async () => {
    await writeTestFile('test-valid.md', '---\ntype: skill\nname: Test Skill\ndescription: A test skill\ntargets: cursor\n---\n\nSome content here.');
    const result = await runValidate();
    const fileErrors = result.errors.filter(
      (e) => e.file.endsWith('test-valid.md') && !e.message.startsWith('Warning:')
    );
    expect(fileErrors).toHaveLength(0);
    await removeTestFile('test-valid.md');
  });

  it('reports error for unknown frontmatter key', async () => {
    await writeTestFile('test-unknown-key.md', '---\ntype: skill\nname: Test\nunknownKey: bad\ntargets: cursor\n---\n\nContent.');
    const result = await runValidate();
    const fileErrors = result.errors.filter((e) => e.file.endsWith('test-unknown-key.md'));
    expect(fileErrors.some((e) => e.message.includes('Unknown frontmatter key') && e.message.includes('unknownKey'))).toBe(true);
    await removeTestFile('test-unknown-key.md');
  });

  it('reports error for invalid type value', async () => {
    await writeTestFile('test-bad-type.md', '---\ntype: badtype\nname: Test\ntargets: cursor\n---\n\nContent.');
    const result = await runValidate();
    const fileErrors = result.errors.filter((e) => e.file.endsWith('test-bad-type.md'));
    expect(fileErrors.some((e) => e.message.includes('Invalid type value'))).toBe(true);
    await removeTestFile('test-bad-type.md');
  });

  it('reports error for invalid targets value', async () => {
    await writeTestFile('test-bad-targets.md', '---\ntype: skill\nname: Test\ntargets: both\n---\n\nContent.');
    const result = await runValidate();
    const fileErrors = result.errors.filter((e) => e.file.endsWith('test-bad-targets.md'));
    expect(fileErrors.some((e) => e.message.includes('Invalid targets value'))).toBe(true);
    await removeTestFile('test-bad-targets.md');
  });

  it('reports error for empty body', async () => {
    await writeTestFile('test-empty-body.md', '---\ntype: skill\nname: Test\ntargets: cursor\n---\n');
    const result = await runValidate();
    const fileErrors = result.errors.filter((e) => e.file.endsWith('test-empty-body.md'));
    expect(fileErrors.some((e) => e.message.includes('body is empty'))).toBe(true);
    await removeTestFile('test-empty-body.md');
  });

  it('reports warning (not error) for missing targets field', async () => {
    await writeTestFile('test-missing-targets.md', '---\ntype: skill\nname: Test\n---\n\nContent here.');
    const result = await runValidate();
    const fileErrors = result.errors.filter((e) => e.file.endsWith('test-missing-targets.md'));
    const warnings = fileErrors.filter((e) => e.message.startsWith('Warning:'));
    const realErrors = fileErrors.filter((e) => !e.message.startsWith('Warning:'));
    expect(warnings.length).toBeGreaterThan(0);
    expect(realErrors).toHaveLength(0);
    await removeTestFile('test-missing-targets.md');
  });
});
