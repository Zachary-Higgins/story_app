# Security Guidelines

This document provides security best practices for using and extending Story Engine.

## For Package Users

### Story Content Validation

All story JSON files are validated against a strict Zod schema before rendering. This means:
- Invalid JSON is rejected with clear errors
- Type mismatches are caught early
- Malformed story configs won't break your app

**Best practice:** Validate your story JSON locally before deploying:
```bash
npm run build:dist
npm test
```

### Dev Editor Endpoints

The story/content editors and media manager are available only in dev (`npm run dev`) via a Vite middleware. They are not registered in production builds. Do not expose the dev server to the public internet.

### Safe Asset URLs

Story Engine only allows relative paths and `https://` URLs in media assets. Protocol-relative URLs (`//example.com`) are blocked to prevent mixed-content attacks.

**Allowed:**
- `images/my-image.png` (relative)
- `https://example.com/image.png` (HTTPS)

**Blocked:**
- `//example.com/image.png` (protocol-relative)
- `http://example.com/image.png` (HTTP)
- `javascript:alert('xss')` (any non-URL protocol)

### Content Security Policy

Story Engine generates no inline scripts or styles. If you deploy to a custom domain, add CSP headers to protect against XSS:

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           style-src 'self' https://fonts.googleapis.com; 
           font-src 'self' https://fonts.gstatic.com; 
           img-src 'self' https:; 
           script-src 'self';" />
```

### Secrets & Environment Variables

Never commit `.env` files or hardcode secrets in your content. Use GitHub Secrets or your deployment platform's secret management.

## For Contributors

### Dependency Updates

Keep dependencies current:
```bash
npm audit
npm audit fix
npm update
```

Before merging PRs, verify:
- `npm run lint` passes
- `npm test` passes
- `npm run build:dist` succeeds
- No new `npm audit` warnings

### Code Review Checklist

When reviewing changes:
- ✅ No `dangerouslySetInnerHTML` or `innerHTML` usage
- ✅ No `eval()` or `Function()` constructors
- ✅ No hardcoded secrets or credentials
- ✅ TypeScript strict mode enabled (`tsconfig.json`)
- ✅ User input validated before use
- ✅ External URLs use HTTPS only

### Story Schema Enforcement

All story configurations must pass validation. The schema enforces:
- Type safety (TypeScript + Zod)
- Safe URLs (HTTPS or relative paths only)
- Allowed layouts (hero, split, timeline, immersive)
- Valid themes (dark-cinematic, light-editorial, bold-gradient)

Invalid stories are rejected during build time, not runtime.

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** open a public GitHub issue
2. Email: [security contact - add when decided]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We'll acknowledge your report within 48 hours and work on a fix.

## Deployment Checklist

Before deploying to production:

- [ ] Update dependencies: `npm audit fix`
- [ ] Run tests: `npm test`
- [ ] Build package: `npm run build:release`
- [ ] Enable HTTPS on your domain
- [ ] Add CSP headers (see above)
- [ ] Replace sample images with your own content
- [ ] Enable branch protection on main branch
- [ ] Configure Dependabot alerts (GitHub Settings → Security)

## Additional Resources

- [Zod Documentation](https://zod.dev) — Schema validation
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) — MDN guide
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Web security best practices
