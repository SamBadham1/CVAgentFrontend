# Build Vue SPA
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html ./
COPY tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY vite.config.ts ./
COPY public ./public
COPY src ./src

RUN npm run build

# Serve with nginx; entrypoint writes runtime-config.js from BACKEND_URL
FROM nginx:1.27-alpine AS runtime

ENV PORT=8080
ENV BACKEND_URL=

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /cvagent-entrypoint.sh
RUN chmod +x /cvagent-entrypoint.sh

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

ENTRYPOINT ["/cvagent-entrypoint.sh"]
