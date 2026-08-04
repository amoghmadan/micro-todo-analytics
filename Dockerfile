# Build the SPA
FROM node:24-alpine AS build-env
COPY . /app
WORKDIR /app
RUN npm ci && npm run build

# Serve the SPA with NGINX and proxy screens + actions to the web-gateway
FROM nginx:alpine
ENV WEB_GATEWAY_URL=http://web-gateway:3000
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build-env /app/build/client /usr/share/nginx/html
