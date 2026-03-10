import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import yaml from 'js-yaml';
import { writeCursorRules } from '../src/adapters/cursor';
import type { SourceFile } from '../src/types';

describe('cursor adapter', () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cursor-test-'));
  });

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  function makeSource(overrides: Partial<SourceFile> = {}): SourceFile {
    return {
      path: '/home/user/.agent-skills/skills/my-skill.md',
      type: 'skill',
      name: 'My Skill',
      description: 'Does something useful',
      targets: 'cursor',
      content: '# My Skill\n\nThis is the body.\n',
      ...overrides,
    };
  }

  it('writes .mdc file for cursor target', async () => {
    const source = makeSource({ targets: 'cursor' });
    const written = await writeCursorRules([source], tmpDir);

    expect(written).toHaveLength(1);
    expect(written[0]).toBe(path.join(tmpDir, 'my-skill.mdc'));

    const content = await fs.readFile(written[0], 'utf-8');
    expect(content).toContain('---');
    expect(content).toContain('Does something useful');
    expect(content).toContain('# My Skill');
  });

  it('writes .mdc file for all target', async () => {
    const source = makeSource({ targets: 'all' });
    const written = await writeCursorRules([source], tmpDir);

    expect(written).toHaveLength(1);
    expect(written[0]).toBe(path.join(tmpDir, 'my-skill.mdc'));
  });

  it('skips non-cursor target', async () => {
    const source = makeSource({ targets: 'claude' });
    const written = await writeCursorRules([source], tmpDir);

    expect(written).toHaveLength(0);
  });

  it('produces kebab-case filename', async () => {
    const source = makeSource({
      path: '/home/user/.agent-skills/skills/mySkillName.md',
      targets: 'cursor',
    });
    const written = await writeCursorRules([source], tmpDir);

    expect(written[0]).toBe(path.join(tmpDir, 'my-skill-name.mdc'));
  });

  it('frontmatter contains description and alwaysApply: true', async () => {
    const source = makeSource({ description: 'Test description', targets: 'cursor' });
    const written = await writeCursorRules([source], tmpDir);

    const content = await fs.readFile(written[0], 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    expect(match).not.toBeNull();

    const fm = yaml.load(match![1]) as Record<string, unknown>;
    expect(fm.description).toBe('Test description');
    expect(fm.alwaysApply).toBe(true);
  });

  it('creates outDir if it does not exist', async () => {
    const nestedDir = path.join(tmpDir, 'nested', 'rules');
    const source = makeSource({ targets: 'cursor' });
    const written = await writeCursorRules([source], nestedDir);

    expect(written).toHaveLength(1);
    const stat = await fs.stat(nestedDir);
    expect(stat.isDirectory()).toBe(true);
  });
});
