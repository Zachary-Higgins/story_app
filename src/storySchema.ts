import { z } from 'zod';

const mediaAssetSchema = z.object({
  type: z.enum(['image', 'video']),
  src: z.string(),
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
  href: z.string(),
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
});

export const storyConfigSchema = z.object({
  theme: z.enum(['dark-cinematic', 'light-editorial', 'bold-gradient']),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  publishedAt: z.string().optional(), // ISO 8601 date string
  backgroundMusic: z.string().optional(),
  badge: z.string().optional(),
  pages: z.array(storyPageSchema),
});

export type StoryConfig = z.infer<typeof storyConfigSchema>;

