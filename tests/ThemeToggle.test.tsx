import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '../src/components/ThemeToggle';
import { BrowserRouter } from 'react-router-dom';

describe('ThemeToggle', () => {
  const renderWithRouter = (theme: 'dark-cinematic' | 'light-editorial' | 'bold-gradient') => {
    return render(
      <BrowserRouter>
        <ThemeToggle theme={theme} onThemeChange={() => {}} />
      </BrowserRouter>
    );
  };

  it('should render theme buttons', () => {
    renderWithRouter('dark-cinematic');
    expect(screen.getByText('Dark Cinematic')).toBeInTheDocument();
    expect(screen.getByText('Light Editorial')).toBeInTheDocument();
    expect(screen.getByText('Bold Gradient')).toBeInTheDocument();
  });

  it('should highlight active theme', () => {
    renderWithRouter('dark-cinematic');
    const activeButton = screen.getByText('Dark Cinematic').closest('button');
    expect(activeButton).toHaveClass('bg-accent');
  });

  it('should render THEME label', () => {
    renderWithRouter('dark-cinematic');
    expect(screen.getByText('THEME')).toBeInTheDocument();
  });
});
