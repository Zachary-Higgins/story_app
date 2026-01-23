import { z } from 'zod';
import { isSafeAssetUrl } from './utils/safeUrl';

const safeUrlString = z
  .string()
  .refine(isSafeAssetUrl, 'URL must be http(s) or a relative path; protocol-relative URLs are blocked');

export const homeConfigSchema = z.object({
  navTitle: z.string(),
  description: z.string().optional(),
  hero: z.object({
    kicker: z.string(),
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
    image: safeUrlString,
    imageAlt: z.string(),
    note: z.string(),
  }),
});

export const aboutConfigSchema = z.object({
  kicker: z.string(),
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(
    z.object({
      title: z.string(),
      content: z.string().optional(),
      items: z.array(z.string()).optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
  cta: z.string().optional(),
});
