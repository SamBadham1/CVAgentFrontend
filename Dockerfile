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

# Serve with nginx (proxies /api and /health to Backend Cloud Run)
FROM nginx:1.27-alpine AS runtime

# Cloud Run provides PORT (default 8080). nginx image envsubst uses
# /etc/nginx/templates/*.template → /etc/nginx/conf.d/
ENV PORT=8080
ENV BACKEND_URL=http://127.0.0.1:3001

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

# Official nginx image entrypoint runs envsubst on templates, then starts nginx
CMD ["nginx", "-g", "daemon off;"]
