import { useLayoutEffect, useRef } from 'react';
import { mountRiverwalk } from './lib/riverwalk';

/** The source HTML remains editable in client/src/content, one file per original URL. */
export default function App({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (root.current) return mountRiverwalk(root.current);
  }, [html]);
  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
