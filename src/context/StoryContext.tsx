/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, ReactNode } from 'react';
import { StoryMeta } from '../data/stories';

interface StoryContextType {
  stories: StoryMeta[];
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export function useStories() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within StoryProvider');
  }
  return context.stories;
}

interface StoryProviderProps {
  children: ReactNode;
  stories: StoryMeta[];
}

export function StoryProvider({ children, stories }: StoryProviderProps) {
  return <StoryContext.Provider value={{ stories }}>{children}</StoryContext.Provider>;
}
