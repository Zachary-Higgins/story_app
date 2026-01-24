/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from 'react';
import { StoryMeta } from '../data/stories';

interface StoryContextType {
  stories: StoryMeta[];
  editorEnabled: boolean;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStories() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within StoryProvider');
  }
  return context.stories;
}

export function useEditorEnabled() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useEditorEnabled must be used within StoryProvider');
  }
  return context.editorEnabled;
}

interface StoryProviderProps {
  children: ReactNode;
  stories: StoryMeta[];
  editorEnabled?: boolean;
}

export function StoryProvider({ children, stories, editorEnabled = false }: StoryProviderProps) {
  return <StoryContext.Provider value={{ stories, editorEnabled }}>{children}</StoryContext.Provider>;
}
