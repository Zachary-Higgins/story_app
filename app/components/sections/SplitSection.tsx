import { StoryPage } from '../../types/story';
import { SectionShell } from '../SectionShell';
import { Media } from '../Media';
import { motion } from 'framer-motion';

interface SplitSectionProps {
  page: StoryPage;
  index: number;
  flip?: boolean;
}

export function SplitSection({ page, index, flip = false }: SplitSectionProps) {
  const content = (
    <div className="space-y-4">
      {page.kicker && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{page.kicker}</p>}
      <h2 className="font-display text-3xl text-white md:text-4xl">{page.title}</h2>
      <div className="space-y-3 text-base text-muted md:text-lg">
        {page.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {page.emphasis && <div className="rounded-2xl bg-elevated/70 px-4 py-3 text-sm text-accent">{page.emphasis}</div>}
      {page.actions && (
        <div className="flex flex-wrap gap-3 pt-2">
          {page.actions.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:-translate-y-0.5 hover:border-accent hover:text-accentStrong"
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const visual = (
    <div className="relative overflow-hidden rounded-2xl border border-accent/10 bg-elevated/50 shadow-soft">
      <Media media={page.background ?? page.foreground} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface/70 to-transparent" />
    </div>
  );

  return (
    <SectionShell page={page} index={index}>
      <div className="grid gap-8 rounded-3xl bg-elevated/60 p-8 md:grid-cols-2 md:p-12">
        {flip ? (
          <>
            {visual}
            {content}
          </>
        ) : (
          <>
            {content}
            {visual}
          </>
        )}
      </div>
    </SectionShell>
  );
}
