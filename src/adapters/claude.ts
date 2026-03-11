import fs from 'fs/promises';
import path from 'path';
import { toKebabCase } from '../sourceFiles.js';
import type { SourceFile } from '../types.js';

function startTag(slug: string): string {
  return `<!-- agent-skills:start:${slug} -->`;
}

function endTag(slug: string): string {
  return `<!-- agent-skills:end:${slug} -->`;
}

function buildSection(source: SourceFile): string {
  const basename = path.basename(source.path, path.extname(source.path));
  const slug = toKebabCase(basename);
  const heading = source.name || basename;
  const body = `## ${heading}\n\n${source.content.trim()}\n`;
  return `${startTag(slug)}\n${body}\n${endTag(slug)}`;
}

export async function writeClaudeMd(sources: SourceFile[], claudeMdPath: string): Promise<void> {
  const filtered = sources.filter(
    (s) => s.targets === 'claude' || s.targets === 'all'
  );

  let existing = '';
  try {
    await fs.access(claudeMdPath);
    existing = await fs.readFile(claudeMdPath, 'utf-8');
  } catch {
    // file doesn't exist yet
  }

  let result = existing;

  for (const source of filtered) {
    const basename = path.basename(source.path, path.extname(source.path));
    const slug = toKebabCase(basename);
    const start = startTag(slug);
    const end = endTag(slug);
    const section = buildSection(source);

    const startIdx = result.indexOf(start);
    const endIdx = result.indexOf(end);

    if (startIdx !== -1 && endIdx !== -1) {
      // Replace existing section
      result = result.slice(0, startIdx) + section + result.slice(endIdx + end.length);
    } else {
      // Append new section
      if (result.length > 0 && !result.endsWith('\n')) {
        result += '\n';
      }
      result += (result.length > 0 ? '\n' : '') + section + '\n';
    }
  }

  await fs.mkdir(path.dirname(claudeMdPath), { recursive: true });
  await fs.writeFile(claudeMdPath, result, 'utf-8');
}
