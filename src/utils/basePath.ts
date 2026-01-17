import { isSafeAssetUrl } from './safeUrl';

const ABSOLUTE_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

export function withBasePath(path?: string): string {
  if (!path) return '';
  const trimmed = path.trim();
  if (!isSafeAssetUrl(trimmed)) return '';

  if (ABSOLUTE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const base = `${(import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '')}/`;
  if (trimmed.startsWith(base)) {
    return trimmed;
  }

  const normalizedPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  return `${base}${normalizedPath}`;
}
