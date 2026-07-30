import { describe, expect, it } from 'vitest';
import { normalizeRedirectTarget } from './redirect';

describe('normalizeRedirectTarget', () => {
  it('converts a same-origin absolute URL into a router-safe relative path', () => {
    expect(normalizeRedirectTarget('http://localhost/play?tab=1#top', '/play')).toBe('/play?tab=1#top');
  });

  it('keeps existing relative paths unchanged', () => {
    expect(normalizeRedirectTarget('/profile?tab=wallet', '/play')).toBe('/profile?tab=wallet');
  });

  it('falls back to the provided default when the redirect is empty', () => {
    expect(normalizeRedirectTarget('', '/play')).toBe('/play');
  });
});
