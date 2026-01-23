import { useEffect, useState } from 'react';
import { withBasePath } from '../utils/basePath';
import { aboutConfigSchema } from '../contentSchema';

interface AboutConfig {
  kicker: string;
  title: string;
  description?: string;
  sections: Array<{
    title: string;
    items?: string[];
    content?: string;
    tags?: string[];
  }>;
  cta?: string;
}

export function AboutPage() {
  const [aboutConfig, setAboutConfig] = useState<AboutConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(withBasePath('/about.json'))
      .then((res) => res.json())
      .then((data) => {
        const parsed = aboutConfigSchema.safeParse(data);
        if (!parsed.success) {
          throw new Error('Invalid about configuration.');
        }
        setAboutConfig(parsed.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-muted">Loading...</div>;
  }

  if (!aboutConfig) {
    return <div className="text-center text-muted">Unable to load about configuration.</div>;
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-elevated/70 p-10 shadow-2xl space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">{aboutConfig.kicker}</p>
        <h1 className="font-display text-4xl text-white">{aboutConfig.title}</h1>
        {aboutConfig.description && <p className="text-lg text-muted">{aboutConfig.description}</p>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {aboutConfig.sections.map((section) => (
          <div key={section.title} className="rounded-2xl bg-surface/70 p-5">
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            {section.items ? (
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted">{section.content}</p>
                {section.tags && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                    {section.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-accent/15 px-3 py-1 text-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {aboutConfig.cta && (
        <div className="rounded-2xl border border-accent/20 bg-surface/80 p-5 text-sm text-muted">
          {aboutConfig.cta}
        </div>
      )}
    </div>
  );
}
