// Used when deploying with `npx wrangler deploy` (Cloudflare Workers).
// Static files come from ./dist; only /api/* runs this code.
import { auth, callback } from './src/oauth.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/auth') return auth(request, env);
    if (pathname === '/api/callback') return callback(request, env);
    return env.ASSETS.fetch(request);
  },
};
