import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { readFileSync } from 'fs'

// Vite dev-server plugin to handle /api/gemini locally
function localApiPlugin() {
  return {
    name: 'local-api-gemini',
    configureServer(server) {
      server.middlewares.use('/api/gemini', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { systemPrompt, userPrompt } = JSON.parse(body);

            if (!systemPrompt || !userPrompt) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing systemPrompt or userPrompt' }));
              return;
            }

            // Read GEMINI_API_KEY from .env file directly (dev only)
            const GEMINI_API_KEY = process.env.GEMINI_API_KEY || (() => {
              try {
                const envFile = readFileSync('.env', 'utf-8');
                const match = envFile.match(/GEMINI_API_KEY="?([^"\n]+)"?/);
                return match ? match[1].trim() : '';
              } catch { return ''; }
            })();

            if (!GEMINI_API_KEY) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY missing from .env' }));
              return;
            }

            const MAX_PROMPT_LENGTH = 60000;
            if (systemPrompt.length + userPrompt.length > MAX_PROMPT_LENGTH) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Payload too large.' }));
              return;
            }

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
            const geminiRes = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }] }],
                generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
              })
            });

            if (!geminiRes.ok) {
              const errData = await geminiRes.json();
              res.statusCode = geminiRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: errData.error?.message || 'Gemini API error' }));
              return;
            }

            const data = await geminiRes.json();
            const textResult = data.candidates[0].content.parts[0].text;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ result: textResult }));
          } catch (err) {
            console.error('[local-api] Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Internal server error: ' + err.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression(),
    localApiPlugin()
  ],
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    alias: {
      'decimal.js-light': 'decimal.js'
    }
  },
  optimizeDeps: {
    include: [
      'recharts',
      'decimal.js'
    ]
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      include: [/recharts/, /node_modules/],
    },
  }
})
