# Use Bun as base image
FROM oven/bun:1.3-slim

# Set username, home path and project dir
ARG USERNAME=web
ARG HOME=/home/$USERNAME
ARG PROJECT_DIR=web-gateway

# Create a new user and group called 'web'
RUN groupadd -r $USERNAME && useradd -r -g $USERNAME -m -d $HOME $USERNAME

# Set the working directory to the app location and change ownership
WORKDIR $HOME/$PROJECT_DIR
RUN chown -R $USERNAME:$USERNAME $HOME/$PROJECT_DIR

# Switch to the new user
USER $USERNAME

# Copy the application code and install dependencies
COPY --chown=$USERNAME:$USERNAME . .
RUN bun install --frozen-lockfile
ENTRYPOINT ["bun", "run", "start"]
