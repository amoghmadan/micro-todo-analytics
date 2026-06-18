# Use Node 26 Slim Trixie as base image
FROM node:26-trixie-slim

# Set username, home path and venv path
ARG USERNAME=api
ARG HOME=/home/$USERNAME
ARG PROJECT_DIR=api-gateway

# Create a new user and group called 'user'
RUN groupadd -r $USERNAME && useradd -r -g $USERNAME -m -d $HOME $USERNAME

# Set the working directory to the app location and change ownership
WORKDIR $HOME/$PROJECT_DIR
RUN chown -R $USERNAME:$USERNAME $HOME/$PROJECT_DIR

# Switch to the new user
USER $USERNAME

# Copy the application code and install dependencies
COPY --chown=$USERNAME:$USERNAME . .
RUN npm ci
ENTRYPOINT ["npm", "start", "runserver"]
