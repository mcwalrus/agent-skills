import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { writeClaudeMd } from '../src/adapters/claude';
import type { SourceFile } from '../src/types';

describe('claude adapter', () => {
  let tmpDir: string;
  let claudeMdPath: string;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'claude-test-'));
    claudeMdPath = path.join(tmpDir, 'CLAUDE.md');
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
      targets: 'claude',
      content: 'This is the skill body.\n',
      ...overrides,
    };
  }

  it('creates new CLAUDE.md if it does not exist', async () => {
    const source = makeSource({ targets: 'claude' });
    await writeClaudeMd([source], claudeMdPath);

    const content = await fs.readFile(claudeMdPath, 'utf-8');
    expect(content).toContain('<!-- agent-skills:start:my-skill -->');
    expect(content).toContain('<!-- agent-skills:end:my-skill -->');
    expect(content).toContain('## My Skill');
    expect(content).toContain('This is the skill body.');
  });

  it('replaces existing section on re-run without destroying other content', async () => {
    const source = makeSource({ targets: 'claude', content: 'Original content.\n' });
    await writeClaudeMd([source], claudeMdPath);

    const updated = makeSource({ targets: 'claude', content: 'Updated content.\n' });
    await writeClaudeMd([updated], claudeMdPath);

    const content = await fs.readFile(claudeMdPath, 'utf-8');
    expect(content).toContain('Updated content.');
    expect(content).not.toContain('Original content.');
  });

  it('preserves manual content outside delimiters', async () => {
    const manual = '# Manual Notes\n\nSome important notes.\n';
    await fs.writeFile(claudeMdPath, manual, 'utf-8');

    const source = makeSource({ targets: 'claude' });
    await writeClaudeMd([source], claudeMdPath);

    const content = await fs.readFile(claudeMdPath, 'utf-8');
    expect(content).toContain('# Manual Notes');
    expect(content).toContain('Some important notes.');
    expect(content).toContain('<!-- agent-skills:start:my-skill -->');
  });

  it('handles multiple sources', async () => {
    const s1 = makeSource({
      path: '/home/user/.agent-skills/skills/skill-one.md',
      name: 'Skill One',
      targets: 'claude',
      content: 'Skill one body.\n',
    });
    const s2 = makeSource({
      path: '/home/user/.agent-skills/rules/rule-two.md',
      name: 'Rule Two',
      targets: 'all',
      content: 'Rule two body.\n',
    });

    await writeClaudeMd([s1, s2], claudeMdPath);

    const content = await fs.readFile(claudeMdPath, 'utf-8');
    expect(content).toContain('<!-- agent-skills:start:skill-one -->');
    expect(content).toContain('<!-- agent-skills:start:rule-two -->');
    expect(content).toContain('Skill one body.');
    expect(content).toContain('Rule two body.');
  });

  it('skips non-claude target', async () => {
    const source = makeSource({ targets: 'cursor' });
    await writeClaudeMd([source], claudeMdPath);

    let fileExists = true;
    try {
      await fs.access(claudeMdPath);
    } catch {
      fileExists = false;
    }

    // Either file not created or content has no sections
    if (fileExists) {
      const content = await fs.readFile(claudeMdPath, 'utf-8');
      expect(content).not.toContain('<!-- agent-skills:start:');
    } else {
      expect(fileExists).toBe(false);
    }
  });
});
