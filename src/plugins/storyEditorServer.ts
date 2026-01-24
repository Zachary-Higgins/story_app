import type { IncomingMessage, ServerResponse } from 'http';
import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';
import { storyConfigSchema } from '../storySchema';
import { aboutConfigSchema, homeConfigSchema } from '../contentSchema';

const STORY_ID_PATTERN = /^[a-zA-Z0-9-_]+$/;
const MEDIA_TYPE_FOLDERS: Record<'image' | 'video' | 'audio', string> = {
  image: 'images',
  video: 'videos',
  audio: 'audio',
};
const CONTENT_FILES = new Set(['home.json', 'about.json']);
const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB
const MEDIA_EXTENSIONS: Record<'image' | 'video' | 'audio', string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'],
  video: ['.mp4', '.webm', '.mov', '.m4v'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a'],
};

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

function getMediaDir(publicDir: string, type: string) {
  if (!Object.keys(MEDIA_TYPE_FOLDERS).includes(type)) return null;
  const folder = MEDIA_TYPE_FOLDERS[type as keyof typeof MEDIA_TYPE_FOLDERS];
  return path.join(publicDir, folder);
}

function listMediaFiles(dir: string, publicDir: string) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir);
  return entries
    .filter((entry) => !entry.startsWith('.'))
    .map((entry) => {
      const filePath = path.join(dir, entry);
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) return null;
      const relative = `/${path.relative(publicDir, filePath).replace(/\\\\/g, '/')}`;
      return {
        name: entry,
        path: relative,
        size: stats.size,
        updatedAt: stats.mtimeMs,
      };
    })
    .filter(Boolean);
}

function sanitizeFileName(name: string) {
  return path.basename(name);
}

function isAllowedOrigin(req: IncomingMessage) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  // In dev mode we allow requests that omit both Origin and Host headers (e.g. some local tools),
  // but otherwise require a valid same-origin request.
  if (!origin && !host) return true;
  if (!origin || !host) return false;
  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

function validateContent(file: string, payload: unknown) {
  if (file === 'home.json') return homeConfigSchema.safeParse(payload);
  if (file === 'about.json') return aboutConfigSchema.safeParse(payload);
  return { success: false };
}

function isAllowedExtension(type: string, fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  const allowed = MEDIA_EXTENSIONS[type as keyof typeof MEDIA_EXTENSIONS] ?? [];
  return allowed.includes(ext);
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
        const mediaType = url.searchParams.get('type') ?? '';
        if (req.method && req.method !== 'GET' && !isAllowedOrigin(req)) {
          return sendJson(res, 403, { error: 'Invalid origin.' });
        }

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

        if (req.method === 'GET' && url.pathname === '/content') {
          const file = url.searchParams.get('file') ?? '';
          if (!CONTENT_FILES.has(file)) return sendJson(res, 400, { error: 'Invalid content file.' });
          const filePath = path.join(publicDir, file);
          if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: 'Content file not found.' });
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            return sendJson(res, 200, JSON.parse(raw));
          } catch {
            return sendJson(res, 500, { error: 'Failed to read content file.' });
          }
        }

        if (req.method === 'PUT' && url.pathname === '/content') {
          const file = url.searchParams.get('file') ?? '';
          if (!CONTENT_FILES.has(file)) return sendJson(res, 400, { error: 'Invalid content file.' });
          const filePath = path.join(publicDir, file);
          try {
            const body = await readRequestBody(req);
            const parsed = JSON.parse(body);
            const validated = validateContent(file, parsed);
            if (!validated.success) {
              return sendJson(res, 400, { error: 'Content file failed validation.' });
            }
            fs.writeFileSync(filePath, JSON.stringify(validated.data, null, 2), 'utf-8');
            return sendJson(res, 200, { ok: true });
          } catch {
            return sendJson(res, 500, { error: 'Failed to write content file.' });
          }
        }

        if (req.method === 'GET' && url.pathname === '/media') {
          const mediaDir = getMediaDir(publicDir, mediaType);
          if (!mediaDir) return sendJson(res, 400, { error: 'Invalid media type.' });
          return sendJson(res, 200, { files: listMediaFiles(mediaDir, publicDir) });
        }

        if (req.method === 'POST' && url.pathname === '/media') {
          const mediaDir = getMediaDir(publicDir, mediaType);
          if (!mediaDir) return sendJson(res, 400, { error: 'Invalid media type.' });
          try {
            const body = await readRequestBody(req);
            const parsed = JSON.parse(body) as { name?: string; data?: string };
            if (!parsed.name || !parsed.data) {
              return sendJson(res, 400, { error: 'Missing file name or data.' });
            }
            const fileName = sanitizeFileName(parsed.name);
            if (!isAllowedExtension(mediaType, fileName)) {
              return sendJson(res, 400, { error: 'Unsupported file type.' });
            }
            const data = parsed.data.split(',')[1] ?? '';
            if (!data) {
              return sendJson(res, 400, { error: 'Invalid file data.' });
            }
            fs.mkdirSync(mediaDir, { recursive: true });
            const targetPath = path.join(mediaDir, fileName);
            if (fs.existsSync(targetPath)) {
              return sendJson(res, 409, { error: 'File already exists.' });
            }
            const buffer = Buffer.from(data, 'base64');
            if (buffer.length > MAX_UPLOAD_BYTES) {
              return sendJson(res, 400, { error: 'File is too large.' });
            }
            fs.writeFileSync(targetPath, buffer);
            return sendJson(res, 200, {
              ok: true,
              path: `/${MEDIA_TYPE_FOLDERS[mediaType as keyof typeof MEDIA_TYPE_FOLDERS]}/${fileName}`,
            });
          } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
              // Log detailed error information in development to help debug upload failures.
              // eslint-disable-next-line no-console
              console.error('[storyEditorServer] Failed to upload media file:', err);
              const message = err instanceof Error ? err.message : String(err);
              return sendJson(res, 500, { error: 'Failed to upload file.', details: message });
            }
            return sendJson(res, 500, { error: 'Failed to upload file.' });
          }
        }

        if (req.method === 'DELETE' && url.pathname === '/media') {
          const mediaDir = getMediaDir(publicDir, mediaType);
          if (!mediaDir) return sendJson(res, 400, { error: 'Invalid media type.' });
          const name = url.searchParams.get('name') ?? '';
          const fileName = sanitizeFileName(name);
          if (!fileName) return sendJson(res, 400, { error: 'Invalid file name.' });
          const filePath = path.join(mediaDir, fileName);
          if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: 'File not found.' });
          try {
            const trashDir = path.join(publicDir, '.trash', MEDIA_TYPE_FOLDERS[mediaType as keyof typeof MEDIA_TYPE_FOLDERS]);
            fs.mkdirSync(trashDir, { recursive: true });
            const targetPath = path.join(trashDir, `${Date.now()}-${fileName}`);
            fs.renameSync(filePath, targetPath);
            return sendJson(res, 200, { ok: true });
          } catch {
            return sendJson(res, 500, { error: 'Failed to delete file.' });
          }
        }

        return next();
      });
    },
  };
}
