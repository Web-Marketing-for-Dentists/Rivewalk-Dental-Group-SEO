import fs from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const project = process.cwd();
const output = path.join(project, 'dist/public');
const content = path.join(project, 'client/src/content');
const pages = JSON.parse(await fs.readFile(path.join(content, 'manifest.json'), 'utf8'));
const shell = await fs.readFile(path.join(output, 'index.html'), 'utf8');
const runtimeScripts = [...shell.matchAll(/<script\b[^>]*\bsrc="[^"]+"[^>]*>[\s\S]*?<\/script>/g)].map(match => match[0]).join('\n');
const styles = [...shell.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)].map(match => match[0]).filter(tag => !tag.includes('fonts.googleapis.com')).join('\n');
if (!runtimeScripts || !styles) throw new Error('Built application script or stylesheet not found.');
const env = { ...loadEnv('production', project, ''), ...process.env };
const indexable = env.VITE_ALLOW_INDEXING === 'true';
const robots = indexable ? 'index, follow' : 'noindex, nofollow';
for (const page of pages) {
  const body = await fs.readFile(path.join(content, page.file), 'utf8');
  const { head } = JSON.parse(await fs.readFile(path.join(content, 'metadata', page.headFile), 'utf8'));
  const destination = path.join(output, page.path === '/' ? 'index.html' : `${page.path.replace(/^\/|\/$/g, '')}/index.html`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, `<!doctype html>\n<html lang="en"><head>\n${head}\n<meta name="robots" content="${robots}" />\n${styles}\n</head><body class="${page.bodyClass}"><div id="root" data-route="${page.path}">${body}</div>\n${runtimeScripts}\n</body></html>\n`);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(page => `  <url><loc>https://www.riverwalkdentalgroup.com${page.path}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(output, 'sitemap.xml'), sitemap);
await fs.writeFile(path.join(output, 'robots.txt'), indexable ? 'User-agent: *\nAllow: /\nSitemap: https://www.riverwalkdentalgroup.com/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n');
console.log(`Pre-rendered ${pages.length} full HTML pages. Search indexing: ${indexable ? 'enabled' : 'disabled for staging'}.`);
