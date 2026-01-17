import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollProgress } from '../src/components/ScrollProgress';

describe('ScrollProgress', () => {
  it('should render without errors', () => {
    const { container } = render(<ScrollProgress />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have fixed positioning class', () => {
    const { container } = render(<ScrollProgress />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('fixed');
  });

  it('should contain progress bar element', () => {
    const { container } = render(<ScrollProgress />);
    const progressBar = container.querySelector('.bg-gradient-to-r');
    expect(progressBar).toBeInTheDocument();
  });
});

