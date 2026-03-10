/**
 * Generates one Cursor/Claude skill per article under _articles.
 * Each skill embeds the article content so it is self-contained and portable
 * when copied to other projects; _articles remains the canonical source.
 * Run from repo root: node scripts/generate-skills.js
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ARTICLES_DIR = path.join(process.cwd(), '_articles');
const SKILLS_DIR = path.join(process.cwd(), '.cursor', 'skills');

const DESCRIPTION_MAX_LENGTH = 1024;
const NAME_MAX_LENGTH = 64;

function collectSlugs(dirPath = '', fileArray = []) {
    const fullPath = path.join(ARTICLES_DIR, dirPath);
    if (!fs.existsSync(fullPath)) return fileArray;
    const files = fs.readdirSync(fullPath);
    files.forEach((file) => {
        const full = path.join(fullPath, file);
        const relative = dirPath ? path.join(dirPath, file) : file;
        if (fs.statSync(full).isDirectory()) {
            collectSlugs(relative, fileArray);
        } else if (file.endsWith('.md')) {
            fileArray.push(relative.split(path.sep).join('/'));
        }
    });
    return fileArray;
}

function deriveTitleAndExcerpt(data, content) {
    let title = data.title || '';
    let excerpt = data.excerpt || '';
    if (!title || !excerpt) {
        const trimmed = (content || '').trim();
        const firstLine = trimmed.split('\n')[0] || '';
        const h1Match = firstLine.match(/^#\s+(.+)$/);
        if (!title) title = h1Match ? h1Match[1].trim() : 'Article';
        if (!excerpt) {
            const afterFirst = trimmed.slice(firstLine.length).trim();
            const firstBlock = afterFirst.split(/\n\n/)[0] || '';
            excerpt = firstBlock.replace(/\n/g, ' ').slice(0, 200).trim() || 'See article for details.';
        }
    }
    return { title, excerpt };
}

function buildDescription(title, excerpt) {
    const desc = `${title}. ${excerpt} Use when the user asks about: ${title.toLowerCase()}, or related topics from this article.`;
    if (desc.length <= DESCRIPTION_MAX_LENGTH) return desc;
    return desc.slice(0, DESCRIPTION_MAX_LENGTH - 3) + '...';
}

function escapeYamlString(s) {
    if (s.includes('\n') || s.includes('"') || s.includes("'")) {
        return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
    }
    return s.includes(':') || s.startsWith(' ') ? `"${s}"` : s;
}

function generateSkillName(slug) {
    const name = slug.replace(/\.md$/, '').replace(/\//g, '-').toLowerCase();
    return name.length > NAME_MAX_LENGTH ? name.slice(0, NAME_MAX_LENGTH) : name;
}

function generateSkillMd(slug, title, excerpt, articleContent) {
    const description = buildDescription(title, excerpt);
    const name = generateSkillName(slug);
    const body = (articleContent || '').trim() || `# ${title}\n\nSee documentation for details.`;
    return `---
name: ${name}
description: ${escapeYamlString(description)}
---

${body}
`;
}

function main() {
    const slugs = collectSlugs();
    if (!fs.existsSync(SKILLS_DIR)) {
        fs.mkdirSync(SKILLS_DIR, { recursive: true });
    }
    let created = 0;
    let errors = 0;
    slugs.forEach((slug) => {
        const fullPath = path.join(ARTICLES_DIR, slug);
        let fileContents;
        try {
            fileContents = fs.readFileSync(fullPath, 'utf8');
        } catch (err) {
            console.error(`Could not read ${fullPath}:`, err.message);
            errors += 1;
            return;
        }
        const { data, content } = matter(fileContents);
        const { title, excerpt } = deriveTitleAndExcerpt(data, content);
        const skillName = generateSkillName(slug);
        const skillDir = path.join(SKILLS_DIR, skillName);
        if (!fs.existsSync(skillDir)) {
            fs.mkdirSync(skillDir, { recursive: true });
        }
        const skillMd = generateSkillMd(slug, title, excerpt, content);
        const skillPath = path.join(skillDir, 'SKILL.md');
        fs.writeFileSync(skillPath, skillMd, 'utf8');
        created += 1;
    });
    console.log(`Generated ${created} skills in .cursor/skills/`);
    if (errors) console.error(`${errors} file(s) skipped due to errors.`);
}

main();
