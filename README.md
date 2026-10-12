# Tammy Adelhardt portfolio

Edit the site at `https://YOUR-SITE/admin` (sign in with GitHub). Saving there updates the live site in about a minute.

## One-time setup

1. **GitHub repo.** Create a repo (private is fine) under Tammy's GitHub account, or add her as a collaborator with *Write* access. Upload everything in this folder (`dist/` is built automatically and is not needed).
2. **Cloudflare.** Workers & Pages → Create → connect the repo. Settings that matter:
   - Root directory: leave blank (or `/`). This is the repo folder the build runs in, **not** the output folder. If you uploaded this folder *inside* another folder in the repo, enter that folder's name.
   - Build command: `node build.js`
   - Deploy command: `npx wrangler deploy` (the output folder `dist` is set in `wrangler.jsonc`)
   - In `wrangler.jsonc`, `name` must match your Worker's name in the dashboard.
   If you instead create a classic *Pages* project: Root directory blank, build command `node build.js`, build output directory `dist`. No deploy command.
3. **GitHub OAuth app** (lets the editor sign in). GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: your site address
   - Authorization callback URL: `https://YOUR-SITE/api/callback`
   Create it, then generate a client secret.
4. **Add the keys to Cloudflare** as *runtime* variables (Worker/Pages project → Settings → Variables and secrets), not "Build variables":
   - `GITHUB_CLIENT_ID` = the client ID
   - `GITHUB_CLIENT_SECRET` = the client secret (as a secret)
   Then redeploy.
5. **Point the editor at your site.** In GitHub, open `public/admin/config.yml` and replace the four `YOUR-…` values (repo, `base_url`, `site_url`, `display_url`). Commit.
6. Go to `/admin` and choose *Login with GitHub*.

## Custom domain
Pages project → Custom domains. Afterwards update `base_url`, `site_url` and `display_url` in `public/admin/config.yml`, and the two URLs in the GitHub OAuth app, to the new address.

## Day to day (in /admin)
- **Portfolio → Projects:** add, drag to reorder, edit, delete. Upload an image with each project.
- **Site text:** headings, about text, contact details, software list, footer, and an optional portfolio PDF.
- Click **Publish** to save. Filter buttons and the project count update automatically from the categories used.

## Still to add
- `public/favicon.ico`
- Portfolio PDF: upload it in /admin → Site text (the download link appears once it's set)

## Notes
- New categories: add them to the `category` options in `public/admin/config.yml`.
- Only people with write access to the repo can save changes, even though anyone can open /admin.
- Preview locally: `node build.js`, then open `dist/index.html` (images and styles need a local server, e.g. `npx serve dist`).
