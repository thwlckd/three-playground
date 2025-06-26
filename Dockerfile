# syntax=docker.io/docker/dockerfile:1

# ✅ Base Image
FROM node:22.16.0-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

# ✅ Copy Zero-Install Yarn Files
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
COPY .pnp.cjs .pnp.cjs
COPY .pnp.loader.mjs .pnp.loader.mjs

# =====================================================================================

# 📦 Dependencies Stage (No yarn install needed for Zero-Install)
FROM base AS deps

# PnP already handles module resolution via .pnp.cjs
# No node_modules needed!

# =====================================================================================

# 🛠 Build Stage
FROM base AS builder

WORKDIR /app

# Copy entire app source (to avoid partial overwrite)
COPY . .

# Set cache folder inside project
RUN yarn config set cacheFolder ./.yarn/cache

# Install dependencies and build
RUN yarn install --immutable
RUN yarn build

# =====================================================================================

# 🚀 Production Runtime
FROM node:22.16.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV HOME=/app
ENV NODE_OPTIONS="--require ./.pnp.cjs"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build output and runtime dependencies
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/.pnp.cjs ./
COPY --from=builder /app/.pnp.loader.mjs ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn /app/.yarn

# Fix permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
