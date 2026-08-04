# web-ui

A dumb React Router SPA that renders Server-Driven UI (SDUI) screens. It only
knows two generic endpoints served by the web-gateway:

- `GET /ui/sdui/<screen>` — fetch the JSON component tree for a screen;
- `POST /action/<action>` — submit a form action.

It renders whatever components the JSON describes and submits whatever action a
form carries — it has no knowledge of auth, data models, or business logic. The
SPA routes live at the root (`/home`, `/login`, `/dashboard`, ...).

## Development

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` and proxies `/ui/sdui/*` and
`/action/*` to the web-gateway at `http://localhost:3000` (see
`vite.config.ts`). Start the web-gateway first (`bun run dev` in
`gateways/web-gateway`).

## Production build

```bash
npm run build
```

Output: `build/client` (static SPA). Assets are emitted under `/assets`.

## Deployment

The web-ui is deployed independently behind NGINX; it is not served by the
web-gateway. NGINX:

- serves the SPA from `/usr/share/nginx/html` at `/`, with an SPA fallback to
  `/index.html`;
- proxies `GET /ui/sdui/*` (screen fetching) and `POST /action/*` (actions) to
  the web-gateway.

### Docker

```bash
docker build -t web-ui:0.1.0 .

# Run the container
docker run -p 8080:80 -e WEB_GATEWAY_URL=http://localhost:3000 web-ui:0.1.0
```

`WEB_GATEWAY_URL` is the address of the web-gateway (default
`http://web-gateway:3000`); it must not contain a path. The NGINX config is
`nginx/default.conf.template` and is rendered at container start via envsubst.
