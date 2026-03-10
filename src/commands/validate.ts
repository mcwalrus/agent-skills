import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import os from 'os';

export interface ValidationError {
  file: string;
  line?: number;
  message: string;
}

const VALID_KEYS = new Set(['type', 'name', 'description', 'targets']);
const VALID_TYPES = new Set(['skill', 'rule', 'suggestion']);
const VALID_TARGETS = new Set(['cursor', 'claude', 'all']);

async function getMdFiles(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir);
    return entries
      .filter((e) => e.endsWith('.md'))
      .map((e) => path.join(dir, e));
  } catch {
    return [];
  }
}

export async function runValidate(): Promise<{ valid: boolean; errors: ValidationError[] }> {
  const baseDir = path.join(os.homedir(), '.agent-skills');
  const subdirs = ['skills', 'rules', 'suggestions'];

  const errors: ValidationError[] = [];

  for (const subdir of subdirs) {
    const dir = path.join(baseDir, subdir);
    const files = await getMdFiles(dir);

    for (const filePath of files) {
      const raw = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(raw);

      // Unknown frontmatter keys
      for (const key of Object.keys(data)) {
        if (!VALID_KEYS.has(key)) {
          errors.push({ file: filePath, message: `Unknown frontmatter key: "${key}"` });
        }
      }

      // Invalid type value
      if (data.type !== undefined && !VALID_TYPES.has(data.type)) {
        errors.push({ file: filePath, message: `Invalid type value: "${data.type}". Must be one of: skill, rule, suggestion` });
      }

      // Invalid targets value
      if (data.targets !== undefined && !VALID_TARGETS.has(data.targets)) {
        errors.push({ file: filePath, message: `Invalid targets value: "${data.targets}". Must be one of: cursor, claude, all` });
      }

      // Missing targets warning (not error)
      if (data.targets === undefined) {
        errors.push({ file: filePath, message: `Warning: missing targets field — file will be skipped during sync` });
      }

      // Empty body
      if (!content.trim()) {
        errors.push({ file: filePath, message: 'File body is empty (no content beyond frontmatter)' });
      }
    }
  }

  // Only real errors (not warnings) determine valid
  const realErrors = errors.filter((e) => !e.message.startsWith('Warning:'));
  return { valid: realErrors.length === 0, errors };
}
