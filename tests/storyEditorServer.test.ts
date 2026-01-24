// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Readable } from 'stream';
import { storyEditorServer } from '../config/storyEditorServer';

interface MockRequest extends Readable {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
}

interface MockResponse {
  statusCode: number;
  headers: Record<string, string>;
  body?: string;
  setHeader: (key: string, value: string) => void;
  end: (data: string) => void;
}

type MiddlewareHandler = (req: MockRequest, res: MockResponse, next: () => void) => void | Promise<void>;

interface TestServer {
  config: { publicDir: string };
  middlewares: { use: (path: string, handler: MiddlewareHandler) => void };
}

function createTempContentDir() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'story-editor-'));
  fs.mkdirSync(path.join(dir, 'stories'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
  return dir;
}

function createHandler(publicDir: string) {
  const handlers: MiddlewareHandler[] = [];
  const plugin = storyEditorServer();
  const server: TestServer = {
    config: { publicDir },
    middlewares: {
      use: (_path, handler) => {
        handlers.push(handler);
      },
    },
  };
  plugin.configureServer?.(server as unknown as Parameters<NonNullable<typeof plugin.configureServer>>[0]);
  return handlers[0]!;
}

async function runRequest(
  handler: MiddlewareHandler,
  {
    method,
    url,
    body,
    headers = {},
  }: { method: string; url: string; body?: string; headers?: Record<string, string> }
) {
  const req = Readable.from(body ? [Buffer.from(body)] : []) as MockRequest;
  req.method = method;
  req.url = url;
  req.headers = headers;
  const res: MockResponse = {
    statusCode: 200,
    headers: {},
    setHeader(key: string, value: string) {
      this.headers[key] = value;
    },
    end(data: string) {
      this.body = data;
    },
  };
  const next = vi.fn();
  await handler(req, res, next);
  return res;
}

describe('storyEditorServer', () => {
  let publicDir: string;
  let handler: ReturnType<typeof createHandler>;

  beforeEach(() => {
    publicDir = createTempContentDir();
    handler = createHandler(publicDir);
  });

  afterEach(() => {
    fs.rmSync(publicDir, { recursive: true, force: true });
  });

  it('lists stories from the content directory', async () => {
    fs.writeFileSync(path.join(publicDir, 'stories', 'alpha.json'), JSON.stringify({}));
    fs.writeFileSync(path.join(publicDir, 'stories', 'beta.json'), JSON.stringify({}));

    const res = await runRequest(handler, { method: 'GET', url: '/index' });
    const payload = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    const ids = payload.stories.map((story: { id: string }) => story.id).sort();
    const paths = payload.stories.map((story: { configPath: string }) => story.configPath).sort();
    expect(ids).toEqual(['alpha', 'beta']);
    expect(paths).toEqual(['/stories/alpha.json', '/stories/beta.json']);
  });

  it('reads and writes story configs', async () => {
    const storyPath = path.join(publicDir, 'stories', 'sample.json');
    const storyConfig = {
      theme: 'dark-cinematic',
      title: 'Sample',
      pages: [
        { id: 'section-1', title: 'Section 1', body: ['Body'], layout: 'hero' },
      ],
    };
    fs.writeFileSync(storyPath, JSON.stringify(storyConfig));

    const readRes = await runRequest(handler, {
      method: 'GET',
      url: '/story?id=sample',
    });
    expect(readRes.statusCode).toBe(200);
    expect(JSON.parse(readRes.body).title).toBe('Sample');

    const updated = { ...storyConfig, title: 'Updated' };
    const writeRes = await runRequest(handler, {
      method: 'PUT',
      url: '/story?id=sample',
      body: JSON.stringify(updated),
      headers: { origin: 'http://localhost', host: 'localhost' },
    });
    expect(writeRes.statusCode).toBe(200);
    expect(JSON.parse(fs.readFileSync(storyPath, 'utf-8')).title).toBe('Updated');
  });

  it('reads and writes home/about content', async () => {
    const homeConfig = {
      navTitle: 'Story Engine',
      description: 'Intro',
      hero: {
        kicker: 'Hello',
        title: 'Welcome',
        body: 'Body',
        tags: ['tag'],
        image: '/images/hero.jpg',
        imageAlt: 'Hero',
        note: 'Note',
      },
    };
    const aboutConfig = {
      kicker: 'About',
      title: 'About Us',
      description: 'Desc',
      sections: [{ title: 'Section', content: 'Copy' }],
      cta: 'CTA',
    };
    fs.writeFileSync(path.join(publicDir, 'home.json'), JSON.stringify(homeConfig));

    const homeRes = await runRequest(handler, {
      method: 'GET',
      url: '/content?file=home.json',
    });
    expect(homeRes.statusCode).toBe(200);
    expect(JSON.parse(homeRes.body).navTitle).toBe('Story Engine');

    const aboutRes = await runRequest(handler, {
      method: 'PUT',
      url: '/content?file=about.json',
      body: JSON.stringify(aboutConfig),
      headers: { origin: 'http://localhost', host: 'localhost' },
    });
    expect(aboutRes.statusCode).toBe(200);
    const saved = JSON.parse(fs.readFileSync(path.join(publicDir, 'about.json'), 'utf-8'));
    expect(saved.title).toBe('About Us');
  });

  it('lists media files for the requested type', async () => {
    fs.writeFileSync(path.join(publicDir, 'images', 'photo.jpg'), 'fake');

    const res = await runRequest(handler, { method: 'GET', url: '/media?type=image' });
    const payload = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(payload.files[0].name).toBe('photo.jpg');
    expect(payload.files[0].path.replace(/\\/g, '/')).toBe('/images/photo.jpg');
  });

  it('rejects invalid media types', async () => {
    const res = await runRequest(handler, { method: 'GET', url: '/media?type=pdf' });
    expect(res.statusCode).toBe(400);
  });
});
