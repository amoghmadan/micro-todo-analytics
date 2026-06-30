# task service

task service

## How to set up?

- How to install dependencies?
  ```bash
  npm ci
  ```

## How to run a development server?

- Run the development server.
  ```bash
  npm run dev runserver -- --port 50052
  ```
  
## How to run Node REPL?

- Use the following command to run the Node Shell with context.
  ```bash
  npm start shell
  ```

## How to build an image for deployment?

- Use the following command to build deployable image.
  ```bash
  docker build -t task-service:0.1.0 .
  ```
