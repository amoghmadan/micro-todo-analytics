# auth service

auth service

## Setup Virtual Environment

- How to set up?
  ```bash
  python3.12 -m venv .venv
  ```

## How to set up?

- How to install dependencies?
  ```bash
  pip install -e '.[automation,test]'
  ```

## How to run a development server?

- Build proto.
  ```bash
  auth build
  ```
- Optionally, build proto to a different destination (relative path).
  ```bash
  auth build -o <relative_path>
  ```
- Run the development server.
  ```bash
  auth runserver
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
  auth loaddata <file>.json
  ```
  
## How to run Python REPL?

- Use the following command to run the Python Shell with context.
  ```bash
  auth shell
  ```

## How to build an image for deployment?

- Use the following command to build deployable image.
  ```bash
  docker build -t auth-service:$(python -c "from auth import __version__;print(__version__)") .
  ```
