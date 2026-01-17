import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollProgress } from '../src/components/ScrollProgress';

describe('ScrollProgress', () => {
  it('should render progress indicator', () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should have correct aria attributes', () => {
    render(<ScrollProgress />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  it('should be fixed at top of viewport', () => {
    render(<ScrollProgress />);
    const container = screen.getByRole('progressbar').parentElement;
    expect(container).toHaveClass('fixed');
  });
});
