import { motion, Variants } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { StoryPage } from '../types/story';

const transitionVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  'slide-up': {
    hidden: { opacity: 0, y: 48 },
    visible: { opacity: 1, y: 0 },
  },
  'slide-left': {
    hidden: { opacity: 0, x: 48 },
    visible: { opacity: 1, x: 0 },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
};

const defaultVariants: Variants = transitionVariants.fade;

interface SectionShellProps extends PropsWithChildren {
  page: StoryPage;
  index: number;
}

export function SectionShell({ page, index, children }: SectionShellProps) {
  const variants = transitionVariants[page.transition ?? 'fade'] ?? defaultVariants;
  const citations = page.citations ?? [];
  return (
    <motion.section
      id={page.id}
      className="section-shell relative w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
      transition={{ duration: 0.9, delay: index * 0.02, ease: [0.22, 1, 0.36, 1] }}
      variants={variants}
    >
      {children}
      {citations.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="uppercase tracking-[0.2em] text-muted/70">Citations</span>
          <div className="flex flex-wrap gap-2">
            {citations.map((citation, idx) => (
              <a
                key={`${citation.label}-${idx}`}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-white/70 hover:text-white"
              >
                [{idx + 1}] {citation.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}
