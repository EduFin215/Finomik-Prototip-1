import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import fs from 'fs';

const DEBUG_LOG_PATH = path.join(__dirname, '.cursor', 'debug.log');
const LOG = (message: string, data: Record<string, unknown>) => {
  const ts = Date.now();
  const line = JSON.stringify({ location: 'vite.config.ts', message, data: { ...data, timestamp: ts }, timestamp: ts }) + '\n';
  try {
    fs.mkdirSync(path.dirname(DEBUG_LOG_PATH), { recursive: true });
    fs.appendFileSync(DEBUG_LOG_PATH, line);
  } catch (_) {}
  fetch('http://127.0.0.1:7246/ingest/8dae4054-223c-427f-859a-09466d36a166', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: line.trimEnd() }).catch(() => {});
};

export default defineConfig(({mode}) => {
  // #region agent log
  LOG('vite_defineConfig_start', { mode, hypothesisId: 'H3' });
  // #endregion
  const env = loadEnv(mode, '.', '');
  const config = {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'debug-server-ready',
        configureServer(server: {
          httpServer?: { once: (ev: string, fn: () => void) => void };
          middlewares?: { use: (fn: (req: { url?: string }, res: unknown, next: () => void) => void) => void };
        }) {
          // #region agent log
          LOG('vite_configureServer_called', { hypothesisId: 'H4' });
          // #endregion
          server.httpServer?.once('listening', () => {
            // #region agent log
            LOG('vite_server_listening', { hypothesisId: 'H4' });
            // #endregion
          });
          let firstRequestLogged = false;
          server.middlewares?.use((req, _res, next) => {
            if (!firstRequestLogged) {
              firstRequestLogged = true;
              // #region agent log
              LOG('vite_first_request', { url: req.url, hypothesisId: 'H5' });
              // #endregion
            }
            next();
          });
        },
      },
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '127.0.0.1', // use IP so Safari can connect (localhost can fail on some Macs)
      port: 3000,
      strictPort: true, // fail if 3000 is in use instead of switching to another port
      // Pre-transform entry so first browser load doesn't hang waiting for transform
      warmup: {
        clientFiles: ['./index.html', './src/main.tsx'],
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
  // #region agent log
  LOG('vite_defineConfig_return', { hypothesisId: 'H3' });
  // #endregion
  return config;
});
