import { z } from 'zod';

/**
 * Content index schema for story discovery.
 * Consumers provide a /content/index.json file that lists available stories.
 */
export const contentIndexSchema = z.object({
  version: z.string().optional().default('1.0'),
  stories: z.array(
    z.object({
      id: z.string(),
      configPath: z.string(),
    })
  ),
});

export type ContentIndex = z.infer<typeof contentIndexSchema>;
