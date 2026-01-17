import { motion } from 'framer-motion';
import { StoryPage } from '../../types/story';
import { SectionShell } from '../SectionShell';

interface TimelineSectionProps {
  page: StoryPage;
  index: number;
}

export function TimelineSection({ page, index }: TimelineSectionProps) {
  const items = page.timeline ?? [];
  return (
    <SectionShell page={page} index={index}>
      <div className="rounded-3xl bg-elevated/70 p-8 md:p-10">
        <div className="max-w-4xl space-y-3">
          <p className="text-sm uppercase tracking-[0.18em] text-accent">{page.kicker}</p>
          <h2 className="font-display text-3xl text-white md:text-4xl">{page.title}</h2>
          <p className="text-base text-muted md:text-lg">{page.body.join(' ')}</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {items.map((item, idx) => (
            <motion.div
              key={item.title}
              className="card-surface rounded-2xl p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {item.marker ?? `Step ${idx + 1}`}
              </div>
              <h3 className="mt-2 font-display text-2xl text-white">{item.title}</h3>
              {item.subtitle && <p className="text-sm text-accent">{item.subtitle}</p>}
              <p className="mt-3 text-sm text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
