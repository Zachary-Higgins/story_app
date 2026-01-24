/**
 * Application configuration
 * 
 * contentDir: The directory containing story JSON files, audio, and media assets.
 * If a "content" directory exists, it will be used. Otherwise, falls back to "content-default".
 */

export const appConfig = {
  contentDir: 'content',
  contentDirFallback: 'content-default',
};
