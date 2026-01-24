const SAFE_PROTOCOLS = new Set(['http:', 'https:']);
const ABSOLUTE_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

export function isSafeAssetUrl(value?: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;

  // Block protocol-relative and javascript/data URLs
  if (trimmed.startsWith('//')) return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('blob:')
  )
    return false;

  // Allow root-relative or path-relative URLs
  if (!ABSOLUTE_SCHEME_PATTERN.test(trimmed)) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}
