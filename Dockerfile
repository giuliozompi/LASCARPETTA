# ─── Stage 1: Build frontend ────────────────────────────────────────────────
FROM node:24-alpine AS frontend-builder

WORKDIR /app
RUN npm install -g pnpm

# Copy workspace root files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Copy all lib packages (needed for typecheck + imports)
COPY lib/ ./lib/

# Copy the frontend artifact and a stub for every other workspace package
# so pnpm can resolve the full workspace graph during install
COPY artifacts/lascarpetta/ ./artifacts/lascarpetta/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY scripts/package.json ./scripts/

RUN pnpm install --frozen-lockfile
RUN pnpm run typecheck:libs
RUN pnpm --filter @workspace/lascarpetta run build

# ─── Stage 2: Build API server ──────────────────────────────────────────────
FROM node:24-alpine AS api-builder

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/
COPY artifacts/lascarpetta/package.json ./artifacts/lascarpetta/
COPY scripts/package.json ./scripts/

RUN pnpm install --frozen-lockfile
RUN pnpm run typecheck:libs
RUN pnpm --filter @workspace/api-server run build

# ─── Stage 3: API runner (used by docker-compose `api` service) ─────────────
FROM node:24-alpine AS api-runner

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/lascarpetta/package.json ./artifacts/lascarpetta/
COPY scripts/package.json ./scripts/

RUN pnpm install --prod --filter @workspace/api-server --filter @workspace/db

COPY --from=api-builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "artifacts/api-server/dist/index.mjs"]

# ─── Stage 4: Nginx + frontend (used by docker-compose `web` service) ────────
FROM nginx:alpine AS web-runner

COPY --from=frontend-builder /app/artifacts/lascarpetta/dist /usr/share/nginx/html
COPY nginx.compose.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ─── Stage 5: Single-container all-in-one (alternative, no compose) ──────────
FROM node:24-alpine AS runner

RUN apk add --no-cache nginx supervisor

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json ./lib/db/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/lascarpetta/package.json ./artifacts/lascarpetta/
COPY scripts/package.json ./scripts/

RUN pnpm install --prod --filter @workspace/api-server --filter @workspace/db

COPY --from=api-builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=frontend-builder /app/artifacts/lascarpetta/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
