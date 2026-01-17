const ABSOLUTE_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const PROTOCOL_RELATIVE_PATTERN = /^\/\//;

export function withBasePath(path?: string): string {
  if (!path) return '';

  if (ABSOLUTE_PATTERN.test(path) || PROTOCOL_RELATIVE_PATTERN.test(path)) {
    return path;
  }

  const base = `${(import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '')}/`;
  if (path.startsWith(base)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalizedPath}`;
}
