import { z } from 'zod';
import { isSafeAssetUrl } from './utils/safeUrl';

const safeUrlString = z
  .string()
  .refine(isSafeAssetUrl, 'URL must be http(s) or a relative path; protocol-relative URLs are blocked');

const mediaAssetSchema = z.object({
  type: z.enum(['image', 'video']),
  src: safeUrlString,
  alt: z.string().optional(),
  loop: z.boolean().optional(),
  autoPlay: z.boolean().optional(),
});

const timelineEntrySchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  marker: z.string().optional(),
});

const actionLinkSchema = z.object({
  label: z.string(),
  href: safeUrlString,
});

const citationSchema = z.object({
  label: z.string(),
  url: safeUrlString,
});

const storyPageSchema = z.object({
  id: z.string(),
  title: z.string(),
  kicker: z.string().optional(),
  body: z.array(z.string()),
  layout: z.enum(['hero', 'split', 'timeline', 'immersive']),
  transition: z.enum(['fade', 'slide-up', 'slide-left', 'zoom']).optional(),
  background: mediaAssetSchema.optional(),
  foreground: mediaAssetSchema.optional(),
  actions: z.array(actionLinkSchema).optional(),
  timeline: z.array(timelineEntrySchema).optional(),
  emphasis: z.string().optional(),
  citations: z.array(citationSchema).optional(),
});

export const storyConfigSchema = z.object({
  theme: z.enum(['dark-cinematic', 'light-editorial', 'bold-gradient']),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  publishedAt: z.string().optional(), // ISO 8601 date string
  backgroundMusic: safeUrlString.optional(),
  badge: z.string().optional(),
  citations: z.array(citationSchema).optional(),
  pages: z.array(storyPageSchema),
});

export type StoryConfig = z.infer<typeof storyConfigSchema>;
