import { Link } from 'react-router-dom';
import { StoryMeta, formatDate } from '../data/stories';
import { useHomeConfig } from '../hooks/useHomeConfig';

interface LandingPageProps {
  stories: StoryMeta[];
}

export function LandingPage({ stories }: LandingPageProps) {
  const { homeConfig, loading, error } = useHomeConfig();

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-muted">Loading...</div>;
  }

  if (error || !homeConfig) {
    return <div className="text-center text-muted">Unable to load home configuration.</div>;
  }
  return (
    <div className="relative space-y-10">
      <div className="rounded-3xl bg-gradient-to-br from-surface/90 via-elevated/80 to-surface/90 p-8 shadow-2xl md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">{homeConfig.hero.kicker}</p>
            <h1 className="font-display text-4xl text-white sm:text-5xl">{homeConfig.hero.title}</h1>
            <p className="text-lg text-muted">{homeConfig.hero.body}</p>
            <div className="flex flex-wrap gap-3 text-sm text-muted">
              {homeConfig.hero.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-accent/40 px-3 py-1 text-accent">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="relative ml-auto overflow-hidden rounded-2xl border border-accent/10 bg-elevated/70 shadow-soft max-h-80 max-w-md">
            <img src={homeConfig.hero.image} alt={homeConfig.hero.imageAlt} className="w-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/40 to-surface/80" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-surface/70 p-4 text-sm text-muted shadow-soft">
              {homeConfig.hero.note}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stories.map((story) => (
          <Link
            key={story.id}
            to={`/story/${story.id}`}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-elevated/70 shadow-2xl transition hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <img src={story.cover} alt={story.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-surface/80" />
              {story.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-surface shadow-soft">
                  {story.badge}
                </span>
              )}
            </div>
            <div className="space-y-2 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">{story.subtitle}</p>
              <h2 className="font-display text-2xl text-white">{story.title}</h2>
              <p className="text-sm text-muted">{story.description}</p>
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Enter story
                </div>
                <span className="text-xs text-muted/60">{formatDate(story.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
