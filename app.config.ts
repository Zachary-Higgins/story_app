import fs from 'fs';

/**
 * Application configuration
 *
 * contentDir: The directory containing story JSON files, audio, and media assets.
 * If a "content" directory exists, it will be used. Otherwise, falls back to the bundled "static" directory.
 */

export const appConfig = {
  contentDir: 'content',
  contentDirFallback: 'static',
};

export function resolveContentDir() {
  return fs.existsSync(appConfig.contentDir) ? appConfig.contentDir : appConfig.contentDirFallback;
}
