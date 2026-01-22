import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { storyConfigSchema } from '../src/storySchema';

const STORY_ID_PATTERN = /^[a-zA-Z0-9-_]+$/;

interface StoryIndexEntry {
  id: string;
  configPath: string;
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readRequestBody(req: IncomingMessage): Promise<string> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

function listStories(storiesDir: string): StoryIndexEntry[] {
  if (!fs.existsSync(storiesDir)) return [];
  const files = fs.readdirSync(storiesDir).filter((file) => file.endsWith('.json'));
  return files.map((file) => ({
    id: file.replace('.json', ''),
    configPath: `/stories/${file}`,
  }));
}

function getStoryPath(storiesDir: string, id: string) {
  if (!STORY_ID_PATTERN.test(id)) return null;
  return path.join(storiesDir, `${id}.json`);
}

export function storyEditorServer(): Plugin {
  return {
    name: 'story-editor-server',
    configureServer(server) {
      const publicDir = server.config.publicDir;
      if (!publicDir) return;
      const storiesDir = path.join(publicDir, 'stories');

      server.middlewares.use('/__story-editor', async (req, res, next) => {
        if (!req.url) return next();
        const url = new URL(req.url, 'http://localhost');

        if (req.method === 'GET' && url.pathname === '/index') {
          return sendJson(res, 200, { stories: listStories(storiesDir) });
        }

        if (req.method === 'GET' && url.pathname === '/story') {
          const id = url.searchParams.get('id') ?? '';
          const filePath = getStoryPath(storiesDir, id);
          if (!filePath) return sendJson(res, 400, { error: 'Invalid story id.' });
          if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: 'Story not found.' });
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            return sendJson(res, 200, JSON.parse(raw));
          } catch (err) {
            return sendJson(res, 500, { error: 'Failed to read story.' });
          }
        }

        if (req.method === 'PUT' && url.pathname === '/story') {
          const id = url.searchParams.get('id') ?? '';
          const filePath = getStoryPath(storiesDir, id);
          if (!filePath) return sendJson(res, 400, { error: 'Invalid story id.' });
          try {
            const body = await readRequestBody(req);
            const parsed = JSON.parse(body);
            const validated = storyConfigSchema.safeParse(parsed);
            if (!validated.success) {
              return sendJson(res, 400, { error: 'Story config failed validation.' });
            }
            fs.writeFileSync(filePath, JSON.stringify(validated.data, null, 2), 'utf-8');
            return sendJson(res, 200, { ok: true });
          } catch {
            return sendJson(res, 500, { error: 'Failed to write story.' });
          }
        }

        if (req.method === 'DELETE' && url.pathname === '/story') {
          const id = url.searchParams.get('id') ?? '';
          const filePath = getStoryPath(storiesDir, id);
          if (!filePath) return sendJson(res, 400, { error: 'Invalid story id.' });
          if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: 'Story not found.' });
          try {
            fs.unlinkSync(filePath);
            return sendJson(res, 200, { ok: true });
          } catch {
            return sendJson(res, 500, { error: 'Failed to delete story.' });
          }
        }

        return next();
      });
    },
  };
}
