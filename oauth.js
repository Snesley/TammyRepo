// GitHub sign-in for the /admin editor. Shared by worker.js (Workers) and functions/api/* (Pages).

const clearState = 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0';

export function auth(request, env) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID is not set (add it under the Worker/Pages runtime variables).', { status: 500 });
  }
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    scope: 'repo,user',
    state,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Set-Cookie': `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`,
    },
  });
}

const page = (ok, body) =>
  new Response(body, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Set-Cookie': clearState },
  });

export async function callback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)oauth_state=([^;]+)/);

  if (!code || !state || !cookie || cookie[1] !== state) {
    return page(false, 'Sign-in failed: the request could not be verified. Close this window and try again.');
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'portfolio-cms' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    return page(false, 'Sign-in failed: GitHub did not return a token. Close this window and try again.');
  }

  const payload = JSON.stringify({ token: data.access_token, provider: 'github' });
  const origin = JSON.stringify(url.origin);
  return page(
    true,
    `<!doctype html><meta charset="utf-8"><title>Signing in…</title><p>Signing in…</p>
<script>
(function () {
  var origin = ${origin};
  function receive(e) {
    if (e.origin !== origin) return;
    window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(payload)}, origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>`
  );
}
