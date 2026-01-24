import { motion } from 'framer-motion';
import { StoryPage } from '../../types/story';
import { Media } from '../Media';
import { SectionShell } from '../SectionShell';

interface ImmersiveSectionProps {
  page: StoryPage;
  index: number;
}

export function ImmersiveSection({ page, index }: ImmersiveSectionProps) {
  return (
    <SectionShell page={page} index={index}>
      <div className="relative min-h-[75vh] overflow-hidden rounded-3xl">
        {page.background && (
          <div className="absolute inset-0 z-0">
            <Media media={page.background} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-surface/40 via-surface/30 to-surface/60" />
        <div className="absolute inset-0 z-20 bg-overlay opacity-20" />
        <div className="relative z-30 flex h-full items-center px-6 py-12 md:px-12">
          <motion.div
            className="max-w-3xl space-y-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {page.kicker && <p className="text-sm uppercase tracking-[0.2em] text-accent">{page.kicker}</p>}
            <h2 className="font-display text-4xl text-white md:text-5xl">{page.title}</h2>
            <div className="space-y-3 text-lg text-muted">
              {page.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionShell>
  );
}
