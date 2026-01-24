/**
 * Story Engine - A reusable React storytelling component library
 *
 * This is the main entry point for the Story Engine package.
 * Consuming projects import the StoryEngine component and wrap it with content discovery.
 */

import './styles/index.css';

export { default } from './App';
export { default as StoryEngine } from './App';
export * from './types/story';
export * from './types/contentIndex';
export { stories, formatDate, findStory, type StoryMeta } from './data/stories';
export { storyConfigSchema } from './storySchema';
export { contentIndexSchema } from './types/contentIndex';
export * from './context/StoryContext';
export { withBasePath } from './utils/basePath';
