#!/usr/bin/env node
/**
 * Generate assets/composition.mmd from skills/composition.yaml.
 *
 * YAML schema (minimal — keep this script's parser in sync if you extend it):
 *   # comments start with '#'
 *   <composite-skill>: [<constituent-skill>, <constituent-skill>, ...]
 *
 * Every referenced skill must exist as a directory under skills/.
 *
 * Usage:
 *   node assets/render-composition.mjs          # write composition.mmd
 *   node assets/render-composition.mjs --check  # exit non-zero if stale
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const YAML_PATH = join(REPO_ROOT, 'skills', 'composition.yaml');
const SKILLS_DIR = join(REPO_ROOT, 'skills');
const ASSETS_DIR = HERE;
const MMD_PATH = join(ASSETS_DIR, 'composition.mmd');
const SVG_PATH = join(ASSETS_DIR, 'composition.svg');

/** Parse the constrained YAML schema into { composite -> [parts] }. */
function parseComposition(text) {
  const relations = {};
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) return;
    const m = line.match(/^([a-z0-9][a-z0-9-]*):\s*\[([^\]]*)\]\s*$/);
    if (!m) {
      throw new Error(
        `Line ${i + 1}: expected 'skill: [a, b, c]', got: ${JSON.stringify(raw)}`,
      );
    }
    const [, from, list] = m;
    relations[from] = list
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  });
  return relations;
}

/** List real skill directories under skills/. */
function listSkills() {
  return new Set(
    readdirSync(SKILLS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name),
  );
}

/**
 * Classify each skill in the graph as 'pure' (no outgoing edges),
 * 'composite' (outgoing edges, no cycle reachable), or
 * 'cyclical' (cycle reachable from it, including self-loops).
 *
 * Pure is determined by absence from relations' keys. Composite vs cyclical
 * is decided by DFS from each key: a cycle is found when we revisit a node
 * that's still on the current stack.
 */
function classify(relations) {
  const classes = new Map();

  function hasCycle(start) {
    const stack = new Set();
    function visit(node) {
      if (stack.has(node)) return true; // found a cycle
      stack.add(node);
      for (const next of relations[node] || []) {
        if (visit(next)) return true;
      }
      stack.delete(node);
      return false;
    }
    return visit(start);
  }

  for (const from of Object.keys(relations)) {
    classes.set(from, hasCycle(from) ? 'cyclical' : 'composite');
  }
  // Skills only referenced as targets (never as a key) are pure.
  for (const target of new Set(Object.values(relations).flat())) {
    if (!classes.has(target)) classes.set(target, 'pure');
  }
  return classes;
}

/** Build Mermaid source from the relations map + computed classes. */
function renderMermaid(relations, classes) {
  const byClass = { pure: [], composite: [], cyclical: [] };
  for (const [skill, cls] of classes) byClass[cls].push(skill);
  for (const arr of Object.values(byClass)) arr.sort();

  const edges = [];
  for (const from of Object.keys(relations).sort()) {
    for (const to of relations[from]) {
      edges.push(`  ${from} --> ${to}`);
    }
  }

  const lines = [
    '%% Auto-generated from skills/composition.yaml — do not edit by hand.',
    '%% Regenerate with: node assets/render-composition.mjs',
    'graph LR',
    '  classDef pure fill:#e8f5e9,stroke:#4a7c4a,color:#1b3a1b;',
    '  classDef composite fill:#fff3e0,stroke:#a86b2c,stroke-width:2px,color:#5a3a14;',
    '  classDef cyclical fill:#ffebee,stroke:#c84a4a,stroke-width:3px,color:#5a1414;',
    '',
    ...(edges.length ? edges : ['  %% (no relations yet)']),
    '',
  ];

  if (byClass.pure.length)      lines.push(`  class ${byClass.pure.join(',')} pure;`);
  if (byClass.composite.length) lines.push(`  class ${byClass.composite.join(',')} composite;`);
  if (byClass.cyclical.length)  lines.push(`  class ${byClass.cyclical.join(',')} cyclical;`);
  lines.push('');
  return lines.join('\n');
}

function validate(relations, skills) {
  const errors = [];
  for (const [from, tos] of Object.entries(relations)) {
    if (!skills.has(from)) errors.push(`Unknown composite skill: ${from}`);
    for (const t of tos) {
      if (!skills.has(t)) {
        errors.push(`Unknown constituent skill: ${t} (referenced by ${from})`);
      }
    }
  }
  return errors;
}

function main() {
  if (!existsSync(YAML_PATH)) {
    console.error(`Missing ${YAML_PATH}. Create it before running this script.`);
    process.exit(1);
  }

  let relations;
  try {
    relations = parseComposition(readFileSync(YAML_PATH, 'utf8'));
  } catch (err) {
    console.error(`Failed to parse ${YAML_PATH}:`);
    console.error(`  ${err.message}`);
    process.exit(1);
  }

  const skills = listSkills();
  const errors = validate(relations, skills);
  if (errors.length) {
    console.error('Composition validation failed:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const classes = classify(relations);
  const mmd = renderMermaid(relations, classes);

  const byClass = { pure: [], composite: [], cyclical: [] };
  for (const [s, c] of classes) byClass[c].push(s);
  for (const arr of Object.values(byClass)) arr.sort();

  const compositeCount = byClass.composite.length;
  const cyclicalCount = byClass.cyclical.length;
  const pureCount = byClass.pure.length;
  const constituentCount = new Set(Object.values(relations).flat()).size;

  console.log(`Classes:`);
  console.log(`  pure:      ${pureCount ? byClass.pure.join(', ') : '(none)'}`);
  console.log(`  composite: ${compositeCount ? byClass.composite.join(', ') : '(none)'}`);
  console.log(`  cyclical:  ${cyclicalCount ? byClass.cyclical.join(', ') : '(none)'}`);
  if (cyclicalCount) {
    console.log(`  ! ${cyclicalCount} cyclical skill(s) detected — review for unintended recursion.`);
  }
  console.log('');

  const checkMode = process.argv.includes('--check');

  if (checkMode) {
    let existing = '';
    try {
      existing = readFileSync(MMD_PATH, 'utf8');
    } catch {
      console.error(`--check: ${MMD_PATH} does not exist. Run without --check to generate.`);
      process.exit(1);
    }
    if (existing !== mmd) {
      console.error(`--check: ${MMD_PATH} is stale. Run without --check to regenerate.`);
      process.exit(1);
    }
    console.log('composition.mmd is up to date.');
    return;
  }

  writeFileSync(MMD_PATH, mmd);
  console.log(`Wrote ${MMD_PATH} (${compositeCount} composite, ${pureCount} pure, ${cyclicalCount} cyclical; ${constituentCount} unique constituents)`);
  console.log('');
  console.log('To render the SVG (Mermaid, not Graphviz — `dot` will not parse this):');
  console.log(`  npx -y @mermaid-js/mermaid-cli -i ${MMD_PATH} -o ${SVG_PATH}`);
}

main();