import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import type { SourceFile } from './types.js';

export function toKebabCase(filename: string): string {
  return filename
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export async function readSourceFiles(baseDir: string): Promise<SourceFile[]> {
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
