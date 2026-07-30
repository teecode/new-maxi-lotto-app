export function normalizeRedirectTarget(input: string | null | undefined, fallback: string): string {
  if (!input) return fallback;

  const trimmed = input.trim();
  if (!trimmed) return fallback;

  try {
    const parsed = new URL(trimmed);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : null;
    const isSameOrigin = currentOrigin ? parsed.origin === currentOrigin : true;

    if (isSameOrigin) {
      return parsed.pathname + parsed.search + parsed.hash || fallback;
    }
  } catch {
    // fall through to the relative-path handling below
  }

  return trimmed.startsWith('/') ? trimmed : fallback;
}
