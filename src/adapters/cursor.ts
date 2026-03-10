import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import type { SourceFile } from '../types.js';

function toKebabCase(filename: string): string {
  return filename
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export async function writeCursorRules(sources: SourceFile[], outDir: string): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });

  const written: string[] = [];

  for (const source of sources) {
    if (source.targets !== 'cursor' && source.targets !== 'all') {
      continue;
    }

    const basename = path.basename(source.path, path.extname(source.path));
    const kebabName = toKebabCase(basename);
    const outPath = path.join(outDir, `${kebabName}.mdc`);

    const frontmatter = yaml.dump({
      description: source.description ?? '',
      alwaysApply: true,
    });

    const fileContent = `---\n${frontmatter}---\n${source.content}`;

    await fs.writeFile(outPath, fileContent, 'utf-8');
    written.push(outPath);
  }

  return written;
}
