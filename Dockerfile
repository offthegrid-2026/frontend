# ---- build: compile the React app into static files ----
FROM node:22-alpine AS build
WORKDIR /app

# Dependencies first, so Docker caches them and only reinstalls when the lockfile changes.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- serve: nginx with just the built files ----
# The nginx config (the /api proxy, HTTPS, React Router fallback) is not baked in here -
# it's mounted from otg-deploy/nginx at runtime, because it depends on the domain.
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
