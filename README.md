# tracker service

tracker service

## Setup Virtual Environment

- How to set up?
  ```bash
  python3.12 -m venv .venv
  ```

## How to set up?

- How to install dependencies?
  ```bash
  pip install -e .
  ```

## How to run a development server?

- Build proto.
  ```bash
  tracker build
  ```
- Optionally, build proto to a different destination (relative path).
  ```bash
  tracker build -o <relative_path>
  ```
- Run the development server.
  ```bash
  tracker runserver --port 50053
  ```

## Migrations

- Make migration files
  ```bash
  alembic revision --autogenerate -m "Your message here"
  ```
- Migrate
  ```bash
  alembic upgrade head
  ```
  
## How to load fixtures?

- Use the following command to load fixtures from a JSON file.
  ```bash
  tracker loaddata <file>.json
  ```
  
## How to run Python REPL?

- Use the following command to run the Python Shell with context.
  ```bash
  tracker shell
  ```

## How to build an image for deployment?

- Use the following command to build deployable image.
  ```bash
  docker build -t tracker-service:$(python -c "from tracker import __version__;print(__version__)") .
  ```
