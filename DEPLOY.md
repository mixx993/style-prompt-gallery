# Deploy (static host)

Build artifacts live in `dist/` after `npm run build`. Serve that folder as the site root. Do not deploy the repo root.

## Refresh data before build (optional)

From the site root, with the style library checked out nearby:

```bash
python3 scripts/sync-images.py \
  --styles /path/to/style-prompts/styles \
  --out public/images \
  --catalog /path/to/style-prompts/catalog.json \
  --catalog-out public/data/catalog.json \
  --only-catalog-ids

npm run build
```

## What to upload

Upload the entire contents of `dist/` (including `index.html`, `assets/`, `data/`, `images/`).

## SPA fallback for `/style/:id`

This app uses client-side routes (`/`, `/about`, `/style/:id`). Configure the host so unknown paths serve `index.html` (not a 404).

### Nginx

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/prompt-share-site;   # contents of dist/
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # optional: long-cache hashed assets + images
  location /assets/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
  location /images/ {
    try_files $uri =404;
    add_header Cache-Control "public, max-age=604800";
  }
}
```

### Netlify (`public/_redirects` or `dist/_redirects` after build)

```
/*    /index.html   200
```

Or `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### GitHub Pages

Use a `404.html` that is a copy of `index.html`, or a hash router. For project pages set Vite `base` to `/<repo>/` before building.

### Cloudflare Pages

SPA mode / fallback to `index.html` (default for many frameworks); or `_redirects`:

```
/*    /index.html   200
```

### Python one-liner (local smoke test)

```bash
cd dist && python3 -m http.server 8080
```

Note: plain `http.server` does **not** SPA-fallback; open `/` then navigate in-app, or use `npm run preview` after build.

## Checklist

- [ ] `dist/data/catalog.json` present (~2094 styles, catalog v1.17.0+)
- [ ] `dist/images/{id}.jpg` present for catalog entries
- [ ] Direct load of `/style/<id>` returns the app (SPA fallback OK)
- [ ] Images load offline from same origin (no reliance on remote GitHub)

This repo only prepares artifacts. Deploy the `dist/` folder yourself to your chosen host.
