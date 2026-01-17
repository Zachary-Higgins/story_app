import { StoryPage } from '../../types/story';
import { SectionShell } from '../SectionShell';
import { Media } from '../Media';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  page: StoryPage;
  index: number;
}

export function HeroSection({ page, index }: HeroSectionProps) {
  return (
    <SectionShell page={page} index={index}>
      <div className="relative isolate flex min-h-[80vh] flex-col justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-surface/80 via-surface/60 to-elevated/80 p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-60">
          <Media media={page.background} className="" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
        </div>
        <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            {page.kicker && (
              <div className="inline-flex items-center gap-2 rounded-full bg-elevated/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {page.kicker}
              </div>
            )}
            <motion.h1
              className="font-display text-4xl leading-tight text-white drop-shadow-lg sm:text-5xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              {page.title}
            </motion.h1>
            <motion.div
              className="space-y-3 text-lg text-muted"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.16 }}
            >
              {page.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </motion.div>
            {page.actions && (
              <div className="flex flex-wrap gap-3">
                {page.actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-surface shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accentStrong"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="relative hidden md:block">
            {page.foreground && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-accent/10 bg-elevated/60 shadow-soft">
                <Media media={page.foreground} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
