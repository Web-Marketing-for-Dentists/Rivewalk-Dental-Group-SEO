import { describe, expect, it } from 'vitest';
import { loadEnv } from 'vite';

// VITE_APP_TITLE is a display setting, not a credential; validate its exact value.
describe('website project title', () => {
  it('uses the title requested by the user', () => {
    const settings = { ...loadEnv('development', process.cwd(), 'VITE_'), ...process.env };
    expect(settings.VITE_APP_TITLE).toBe('Rivewalk dental group');
  });
});
