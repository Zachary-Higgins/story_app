import { useEffect, useState } from 'react';
import { withBasePath } from '../utils/basePath';

export interface HomeConfig {
  navTitle: string;
  description?: string;
  hero: {
    kicker: string;
    title: string;
    body: string;
    tags: string[];
    image: string;
    imageAlt: string;
    note: string;
  };
}

let cachedHomeConfig: HomeConfig | null = null;
let pendingHomeConfig: Promise<HomeConfig> | null = null;

async function loadHomeConfig(): Promise<HomeConfig> {
  if (cachedHomeConfig) return cachedHomeConfig;
  if (!pendingHomeConfig) {
    pendingHomeConfig = fetch(withBasePath('/home.json'))
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load home configuration.');
        return res.json();
      })
      .then((data) => {
        const normalized: HomeConfig = {
          ...data,
          navTitle: data.navTitle ?? data.hero?.title ?? 'Story Atlas',
          hero: {
            ...data.hero,
            image: withBasePath(data.hero?.image),
          },
        };
        cachedHomeConfig = normalized;
        return normalized;
      })
      .finally(() => {
        pendingHomeConfig = null;
      });
  }
  return pendingHomeConfig;
}

export function useHomeConfig() {
  const [homeConfig, setHomeConfig] = useState<HomeConfig | null>(cachedHomeConfig);
  const [loading, setLoading] = useState(!cachedHomeConfig);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedHomeConfig) return;
    let active = true;
    loadHomeConfig()
      .then((data) => {
        if (!active) return;
        setHomeConfig(data);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError((err as Error).message);
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { homeConfig, loading, error };
}
