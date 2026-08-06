# micro-todo-analytics

A distributed system built from microservices and Server-Driven UI (SDUI). Auth,
task management and analytics are separate services that communicate over gRPC,
fronted by gateways and a dumb React SPA that renders JSON-driven screens.

```
Browser (React SPA served by NGINX)
   │   httpOnly cookie session
   ├── /ui/sdui/*  ──►  web-gateway (Bun + Hono)   # screen fetching (JSON component trees)
   └── /action/*   ──►  web-gateway (Bun + Hono)   # actions
                          │  bearer token from signed cookie
                          ▼
                       api-gateway (Express: GraphQL + REST accounts)
                          ▼
            auth / task / tracker services (gRPC)
                          │
        ┌─────────────────┼──────────────────┐
      PostgreSQL        MongoDB           RabbitMQ
      (auth, tracker)   (task)            (task events -> analytics)
```

## Components

Everything lives in a git submodule on its own branch.

| Component | Path | Stack | Port | Role |
|---|---|---|---|---|
| auth-service | `services/auth-service` | Python (gRPC + SQLAlchemy, Alembic) | 50051 | Accounts, auth, tokens |
| task-service | `services/task-service` | Node (Express + Mongoose) | 50052 | Todo CRUD, publishes lifecycle events |
| tracker-service | `services/tracker-service` | Python (gRPC + SQLAlchemy, Alembic) | 50053 | Analytics derived from task events |
| tracker-worker | `services/tracker-service` | Celery | — | Consumes `task-service-queue`, writes analytics |
| api-gateway | `gateways/api-gateway` | Node (Express, GraphQL + REST) | 4000 | Single HTTP entry point to the services |
| web-gateway | `gateways/web-gateway` | Bun + Hono | 8080 | SDUI BFF: renders screens, signs session cookie |
| web-ui | `uis/web-ui` | React Router SPA behind NGINX | 3000 / 80 | Renders whatever JSON the web-gateway sends |

Data stores (dev, from Docker Hub): PostgreSQL 17 (`auth`, `tracker`),
MongoDB (`task`), RabbitMQ 3 (`/`, management UI on 15672). Credentials default
to `root` / `toor`.

The web-gateway owns all screen rendering (JSON component trees) and exposes
actions the SPA submits. The web-ui is a dumb client with only two generic
endpoints: `GET /ui/sdui/<screen>` and `POST /action/<action>`. See
`gateways/web-gateway/README.md` for the full flow.

## Getting started

### 1. Check out the submodules

```bash
git submodule update --init --recursive
```

### 2. Run the full stack with Docker Compose

Databases, services, gateways and UI are orchestrated in `deploy/docker-compose.yaml`.
App images are built from the local submodule sources — nothing is pulled from a
registry (only the data-store images are fetched from Docker Hub).

```bash
cd deploy
docker compose up --build
```

Migrations run automatically (Alembic init containers / compose services), then:

- Web UI: http://localhost:3000
- API gateway: http://localhost:4000
- RabbitMQ management: http://localhost:15672 (`root` / `toor`)

Stop with `docker compose down`; wipe the databases with `docker compose down -v`.

### 3. Kubernetes (optional)

Same stack as kustomize manifests in `deploy/k8s/` (StatefulSets, Deployments,
ConfigMap, Secret, Ingress for `mta.local`). See `deploy/README.md` for building
the images, loading them into minikube/kind, and applying the manifests.

## Running components locally

Each component has its own README and `.env.example`. Point every `.env` at the
right hosts/ports, then run against the data stores from `deploy/docker-compose.yaml`
or the standalone databases.

| Component | Install | Run |
|---|---|---|
| auth-service | `python3.14 -m venv .venv && pip install -e '.[automation,test]'` | `auth build && auth runserver` |
| tracker-service | `python3.14 -m venv .venv && pip install -e .` | `tracker build && tracker runserver --port 50053` |
| tracker-worker | same as tracker-service | `celery -A tracker worker -l INFO -Q task-service-queue` |
| task-service | `npm ci` | `npm run dev runserver -- --port 50052` |
| api-gateway | `npm ci` | `npm run dev runserver` |
| web-gateway | `bun install` | `bun run dev` |
| web-ui | `npm install` | `npm run dev` (proxies `/ui/sdui/*` and `/action/*` to the web-gateway) |

Note: services store `SECRET_KEY` and DB/broker credentials in their `.env` — the
values in the `.env.example` files are dev-only and must be rotated before any
real deployment.

## Deployment

See [`deploy/README.md`](deploy/README.md) for the complete deployment guide —
Docker Compose and Kubernetes options, image building/loading, ingress setup and
troubleshooting.

## Repository layout

```
.
├── services/            # gRPC microservices (auth, task, tracker) + worker
├── gateways/            # api-gateway (Express) + web-gateway (SDUI BFF)
├── uis/                 # web-ui: dumb SDUI React SPA
└── deploy/              # docker-compose.yaml + k8s manifests + initdb SQL
```
