# web-gateway

Server-Driven UI (SDUI) Backend-for-Frontend (BFF) built with Bun and Hono.

The web-gateway owns all screen rendering: it produces a declarative JSON
component tree (SDUI) for every page and exposes actions that the SPA submits.
It never exposes microservices directly — it is the single origin the browser
talks to.

```
Browser (React SPA served by NGINX)
   │  httpOnly cookie session
   ├── /ui/sdui/*  ─────────────►  web-gateway (Bun + Hono)   # screen fetching
   │        │                        │
   │        │                        ▼
   │                              screen builders (JSON component trees)
   │
   └── /action/*  ──────────────►  web-gateway (Bun + Hono)   # actions
                                     │  bearer token recovered from signed cookie
                                     ▼
                                  api-gateway (Express, GraphQL + REST accounts)
                                     ▼
                                  auth / task / tracker services (gRPC)
```

The web-gateway and web-ui are deployed separately, and the two concerns are
bifurcated: screen fetching and actions never share a path. The web-ui is a
dumb SPA that only knows `GET /ui/sdui/<screen>` and `POST /action/<action>`.
It has no `/ui` prefix itself — its routes live at the root (`/home`,
`/dashboard`, ...). NGINX serves the SPA and proxies `/ui/sdui/*` and
`/action/*` here.

## How does it work?

- `GET /ui/sdui/session` — resolves the cookie to `{ authenticated, user }`.
- `GET /ui/sdui/<screen>` — returns the JSON component tree for a screen
  (`login`, `register`, `dashboard`, `analytics`, `profile`).
- `POST /action/<action>` — runs an action (`login`, `register`,
  `logout`, `create-task`, `update-task`, `delete-task`, `change-password`)
  with body `{ "fields": { ... } }` and returns
  `{ "ok": true, "redirect"?, "message"? }` or `{ "ok": false, "errors": [...] }`.
- Sessions are stateless: the opaque bearer token returned by the api-gateway
  is stored in an HMAC-signed, httpOnly, SameSite=Lax cookie. The browser never
  sees the token. The cookie is marked `Secure` only when the request is served
  over HTTPS (via `X-Forwarded-Proto` or the request URL); override with
  `COOKIE_SECURE`. This keeps local plain-HTTP development working without a
  `.env`.

## How to set up?

```bash
bun install
cp .env.example .env
```

The web-gateway expects the api-gateway to be running on `API_GATEWAY_URL`.

## How to run a development server?

```bash
bun run dev
```

The web-gateway only exposes the SDUI API under `/ui/sdui/*` and `/action/*`.
In development, run the web-ui dev server (`npm run dev` in `uis/web-ui`)
which proxies both to here.

## How to build an image for deployment?

```bash
docker build -t web-gateway:0.1.0 .
```
