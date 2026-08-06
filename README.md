# Deployment

This directory contains everything needed to run the micro-todo-analytics stack:

- `docker-compose.yaml` — the full stack on a single host (databases, broker, microservices, gateways and UI). Best for local development and testing.
- `k8s/` — Kubernetes manifests (kustomize) describing the same stack for a local cluster (minikube/kind) or a real one.
- `docker/initdb/` — first-run SQL used by the docker-compose Postgres container.

## Prerequisites

- [Docker](https://docs.docker.com/engine/install/) with the compose plugin (`docker compose version`).
- The git submodules checked out (each component is built from its own submodule):
  ```bash
  git submodule update --init --recursive
  ```
- For the Kubernetes option: `kubectl` and a cluster (e.g. [minikube](https://minikube.sigs.k8s.io/) or [kind](https://kind.sigs.k8s.io/)) with an ingress controller.

> **Note:** Every app component reads its configuration from environment variables. The compose file and the k8s ConfigMap/Secret already wire the pieces together, but if you run a component outside this stack, make sure its `.env` points at the right hosts and ports.

## Stack overview

| Component | Image source | Exposed port | Notes |
|---|---|---|---|
| postgres (auth) | `postgres:17-alpine` | 5432 | Single instance hosts `auth` + `tracker` in compose |
| task-db (mongodb) | `mongodb/mongodb-community-server:latest` | 27017 | No auth (mirrors dev setup) |
| mq (rabbitmq) | `rabbitmq:3-management` | 5672 / 15672 | AMQP + management UI (`root`/`toor`) |
| auth-service | submodule `services/auth-service` | 50051 (gRPC) | Runs Alembic migrations on start |
| task-service | submodule `services/task-service` | 50052 (gRPC) | Publishes lifecycle events to the queue |
| tracker-service | submodule `services/tracker-service` | 50053 (gRPC) | Runs Alembic migrations on start |
| tracker-worker | submodule `services/tracker-service` | — | Celery worker, consumes `task-service-queue` |
| api-gateway | submodule `gateways/api-gateway` | 4000 | HTTP -> gRPC proxy for the services |
| web-gateway | submodule `gateways/web-gateway` | 8080 | Session/cookie handling, talks to api-gateway |
| web-ui | submodule `uis/web-ui` | 3000 (compose) / 80 (k8s) | Static frontend, talks to web-gateway |

## Option 1: Docker Compose (local)

Everything runs from this directory. App images are always built from the local submodule sources at startup (`pull_policy: build`) — nothing is pushed to or pulled from a registry. Only the third-party data-store images come from Docker Hub.

```bash
cd deploy
docker compose up --build
```

- First `up` initializes the Postgres volume and creates the `tracker` database via `docker/initdb/01-create-tracker-db.sql`, then runs the Alembic migrations for auth and tracker.
- Services wait on their dependencies (`service_healthy` / `service_completed_successfully`), so `docker compose up` is all you need — no manual ordering.

Open the UI at http://localhost:3000.

Useful commands:

```bash
docker compose ps            # status
docker compose logs -f auth-service   # follow one component
docker compose down         # stop everything (keeps volumes)
docker compose down -v      # stop and wipe the databases
```

## Option 2: Kubernetes (kustomize)

The manifests deploy into the `mta` namespace. Secrets and the ConfigMap are dev-only and mirror the docker-compose credentials — rotate them before any non-local use.

The deployments reference locally built images (`mta/<component>:0.1.0` with `imagePullPolicy: IfNotPresent`), so build the images and load them into your cluster first.

### Build and load the images

```bash
# From the repo root — tag them exactly as the manifests expect
docker build -t mta/auth-service:0.1.0 services/auth-service
docker build -t mta/task-service:0.1.0 services/task-service
docker build -t mta/tracker-service:0.1.0 services/tracker-service
docker build -t mta/api-gateway:0.1.0 gateways/api-gateway
docker build -t mta/web-gateway:0.1.0 gateways/web-gateway
docker build -t mta/web-ui:0.1.0 uis/web-ui
```

Load them into the cluster (pick one, depending on your cluster):

```bash
# minikube
minikube image load mta/auth-service:0.1.0 mta/task-service:0.1.0 mta/tracker-service:0.1.0 \
  mta/api-gateway:0.1.0 mta/web-gateway:0.1.0 mta/web-ui:0.1.0

# kind
kind load docker-image mta/auth-service:0.1.0 mta/task-service:0.1.0 mta/tracker-service:0.1.0 \
  mta/api-gateway:0.1.0 mta/web-gateway:0.1.0 mta/web-ui:0.1.0
```

### Deploy

```bash
kubectl apply -k k8s
kubectl -n mta rollout status deploy --timeout=300s
kubectl -n mta get pods
```

Migrations run automatically as init containers (`alembic upgrade head`) inside the auth and tracker deployments. In k8s each Postgres gets its own StatefulSet with a dedicated database (no initdb script needed).

### Access the UI via ingress

The ingress routes `mta.local` -> `web-ui`. Enable the ingress controller first:

```bash
minikube addons enable ingress    # minikube
```

Map the host to your local machine:

```bash
echo "127.0.0.1 mta.local" | sudo tee -a /etc/hosts
```

Then open http://mta.local. If you are not using the ingress, you can reach the UI directly with:

```bash
kubectl -n mta port-forward svc/web-ui 3000:80     # then open http://localhost:3000
```

### Teardown

```bash
kubectl delete -k k8s       # removes all resources, including PVCs/data
```

## Configuration

| File | Purpose |
|---|---|
| `docker-compose.yaml` | Compose topology, ports, and per-service env |
| `k8s/configmap.yaml` | Non-sensitive shared config (debug flag, gRPC hosts, cookie settings) |
| `k8s/secret.yaml` | Dev-only credentials and connection URLs |
| `k8s/ingress.yaml` | Ingress rule for `mta.local` |
| `docker/initdb/` | First-run SQL executed when the Postgres volume is created |

Defaults are consistent across compose and k8s:

- DB credentials: `root` / `toor`
- RabbitMQ: `root` / `toor`, vhost `/`
- Broker queue consumed by the tracker worker: `task-service-queue`

## Troubleshooting

- **Ports already in use** (compose): the stack binds 3000, 4000, 50051-50053, 5432, 5672, 8080, 15672 and 27017 on the host. Stop whatever is on those ports or edit the `ports:` mapping.
- **Images not found / `ErrImagePull`** (k8s): the image wasn't loaded into the cluster with the exact `mta/<component>:0.1.0` tag, or your cluster is a different Docker daemon (see "Build and load the images").
- **Ingress not routing**: make sure an ingress controller is installed and the `nginx` ingress class is available.
- **DB not ready**: watch the init containers and migration steps first — `kubectl -n mta logs <pod> -c migrate`.
