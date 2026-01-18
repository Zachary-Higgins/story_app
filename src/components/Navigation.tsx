import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoryMeta } from '../data/stories';
import { clsx } from 'clsx';
import { withBasePath } from '../utils/basePath';

interface NavigationProps {
  stories: StoryMeta[];
}

interface HomeConfig {
  navTitle: string;
  description?: string;
}

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export function Navigation({ stories }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState<boolean>(false); // aspect ratio <= 1 (portrait/square)
  const [homeConfig, setHomeConfig] = useState<HomeConfig>({ navTitle: 'Story Atlas' });
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const location = useLocation();

  useEffect(() => {
    fetch(withBasePath('/home.json'))
      .then((res) => res.json())
      .then((data) => setHomeConfig(data))
      .catch(() => {
        setHomeConfig({ navTitle: 'Story Atlas' });
      });
  }, []);

  // Detect portrait/square layout: aspect ratio height >= width (w/h <= 1)
  useEffect(() => {
    const updateScreen = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsCompact(w <= h);
    };
    updateScreen();
    window.addEventListener('resize', updateScreen);
    return () => window.removeEventListener('resize', updateScreen);
  }, []);

  useEffect(() => {
    fetch(withBasePath('/social.json'))
      .then((res) => res.json())
      .then((data) => setSocialLinks(data.links))
      .catch(() => {
        setSocialLinks([]);
      });
  }, []);

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setIsOpen(false)} />}
      {/* Floating expand button when aspect ratio < 1 and menu is collapsed */}
      {isCompact && !isOpen && (
        <button
          aria-label="Open menu"
          aria-expanded={false}
          onClick={() => setIsOpen(true)}
          className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-elevated/90 text-white shadow-soft backdrop-blur-md"
        >
          <span className="space-y-1">
            <span className="block h-0.5 w-5 rounded-full bg-white" />
            <span className="block h-0.5 w-3 rounded-full bg-white" />
            <span className="block h-0.5 w-4 rounded-full bg-white" />
          </span>
        </button>
      )}

      {(!isCompact || isOpen) && (
        <aside
          className={clsx(
            'fixed left-0 top-0 z-40 flex h-full flex-col border-r border-white/5 bg-gradient-to-b from-surface/95 via-surface/92 to-elevated/95 backdrop-blur-lg transition-all duration-500',
            isOpen ? 'w-72 shadow-2xl shadow-black/30' : 'w-16 md:w-20 shadow-lg shadow-black/20'
          )}
          aria-hidden={!isOpen && isCompact}
        >
        <div className="flex items-center gap-3 px-3 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-accent">
          <button
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated/80 text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-elevated"
          >
            <span className="space-y-1">
              <span className="block h-0.5 w-5 rounded-full bg-white" />
              <span className="block h-0.5 w-3 rounded-full bg-white" />
              <span className="block h-0.5 w-4 rounded-full bg-white" />
            </span>
          </button>
          {isOpen && <span className="text-xs text-muted">{homeConfig.navTitle}</span>}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-2 pb-6">
          <div className="space-y-2">
            <Link
              to="/"
              className={clsx(
                'flex items-center rounded-2xl border border-white/5 bg-elevated/70 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-elevated',
                isOpen ? 'h-14 gap-3 px-3' : 'h-14 w-14 justify-center p-0',
                location.pathname === '/' && 'border-accent/60 bg-elevated/90 shadow-soft'
              )}
            >
              <span
                className={clsx(
                  'text-xl text-accent transition-opacity duration-200',
                  isOpen ? 'opacity-0' : 'opacity-100'
                )}
                aria-hidden={!isOpen}
              >
                ⌂
              </span>
              <span
                className={clsx(
                  'overflow-hidden transition-[opacity,max-width] duration-300 ease-out font-serif tracking-wide',
                  isOpen ? 'opacity-100 max-w-[160px] text-lg' : 'opacity-0 max-w-0 text-base'
                )}
              >
                Home
              </span>
            </Link>
          </div>

          <p
            className={clsx(
              'px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted overflow-hidden transition-[opacity,max-height] duration-300',
              isOpen ? 'opacity-100 max-h-6' : 'opacity-0 max-h-0'
            )}
          >
            Stories
          </p>
          <div className="space-y-2">
            {stories.map((story) => {
              const active = location.pathname.includes(story.id);
              return (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className={clsx(
                    'group relative flex items-center rounded-2xl border border-white/5 bg-elevated/70 text-sm text-white transition hover:border-accent/50 hover:bg-elevated',
                    isOpen ? 'h-16 gap-3 px-3' : 'h-14 w-14 justify-center p-0',
                    active && 'border-accent/60 bg-elevated/90 shadow-soft'
                  )}
                  tabIndex={isCompact && !isOpen ? -1 : 0}
                >
                  <span
                    className={clsx(
                      'flex-shrink-0 overflow-hidden rounded-xl bg-surface/80',
                      isOpen ? 'h-12 w-12' : 'h-10 w-10'
                    )}
                  >
                    <img src={story.cover} alt={story.title} className="block h-full w-full object-cover" />
                  </span>
                  <span
                    className={clsx(
                      'flex-1 min-w-0 overflow-hidden transition-[opacity,max-width] duration-200 ease-out',
                      isOpen ? 'opacity-100 max-w-[220px]' : 'opacity-0 max-w-0'
                    )}
                  >
                    <span className="block text-sm font-semibold text-white">{story.title}</span>
                    <span className="block text-xs text-muted truncate">{story.subtitle}</span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 space-y-2">
            <Link
              to="/about"
              className={clsx(
                'flex items-center rounded-2xl border border-white/5 bg-elevated/70 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-elevated',
                isOpen ? 'h-14 gap-3 px-3' : 'h-14 w-14 justify-center p-0',
                location.pathname === '/about' && 'border-accent/60 bg-elevated/90 shadow-soft'
              )}
            >
              <span
                className={clsx(
                  'text-lg text-accent transition-opacity duration-200',
                  isOpen ? 'opacity-0' : 'opacity-100'
                )}
                aria-hidden={!isOpen}
              >
                ✦
              </span>
              <span
                className={clsx(
                  'overflow-hidden transition-[opacity,max-width] duration-300 ease-out font-serif tracking-wide',
                  isOpen ? 'opacity-100 max-w-[160px] text-lg' : 'opacity-0 max-w-0 text-base'
                )}
              >
                About
              </span>
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 px-3 py-3 text-[11px] text-muted">
          {isOpen && socialLinks.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-elevated/50 text-xs text-accent transition hover:border-accent/50 hover:bg-elevated/80"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          )}
          {isOpen ? (
            <>
              <p className="font-semibold text-white">Curated Journeys</p>
              <p className="mt-2 text-muted">Created by Zach Higgins</p>
            </>
          ) : (
            <span className="block text-center">❖</span>
          )}
        </div>
        </aside>
      )}

      <div
        className={clsx(
          'pointer-events-none fixed left-0 top-0 z-30 h-full transition-opacity duration-500 md:hidden',
          isOpen ? 'w-full opacity-100' : 'w-0 opacity-0'
        )}
      />
    </>
  );
}
