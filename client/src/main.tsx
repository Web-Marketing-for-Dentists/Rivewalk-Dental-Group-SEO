import { createRoot } from 'react-dom/client';
import App from './App';
import pages from './content/manifest.json';
import './index.css';

const loaders = import.meta.glob<string>('./content/**/*.html', { query: '?raw', import: 'default' });
const metadata = import.meta.glob<string>('./content/metadata/*.json', { query: '?raw', import: 'default' });
const pathname = window.location.pathname;
const route = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
const page = pages.find(item => item.path === route);
const root = document.getElementById('root')!;

async function start() {
  if (!page) {
    const home = await loaders['./content/home.html']();
    const parsed = new DOMParser().parseFromString(home, 'text/html');
    const main = parsed.querySelector('main');
    if (main) main.innerHTML = '<section class="py-24 px-6 text-center"><h1 class="font-heading text-4xl text-brand-secondary">Page not found</h1><p class="mt-6">The page you requested does not exist.</p><a class="inline-block mt-8 text-brand-primary underline" href="/">Return to Riverwalk Dental Group</a></section>';
    document.title = 'Page not found | Riverwalk Dental Group';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots); }
    robots.content = 'noindex, follow';
    createRoot(root).render(<App html={parsed.body.innerHTML} />);
    return;
  }
  const key = `./content/${page.file}`;
  const html = root.dataset.route === route && root.innerHTML.trim() ? root.innerHTML : await loaders[key]();
  document.body.className = page.bodyClass;
  document.documentElement.classList.remove('no-js');
  document.querySelectorAll('[data-riverwalk-meta]').forEach(node => node.remove());
  const template = document.createElement('template');
  const meta = JSON.parse(await metadata[`./content/metadata/${page.headFile}`]()) as { head: string };
  template.innerHTML = meta.head;
  document.head.append(template.content);
  document.title = page.title;
  createRoot(root).render(<App html={html} />);
}
void start();
