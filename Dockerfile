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
# No `node_modules` needed!

# =====================================================================================

# 🛠 Build Stage
FROM base AS builder

WORKDIR /app

# Copy entire app source (to avoid partial overwrite)
COPY . .

# Build Next.js app (telemetry optional)
# ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn install --immutable
RUN yarn build

# =====================================================================================

# 🚀 Production Runtime
FROM node:22.16.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what's needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy runtime dependencies for PnP
COPY --from=builder /app/.pnp.cjs ./
COPY --from=builder /app/.pnp.loader.mjs ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/.yarn /app/.yarn

# PnP loader requires NODE_OPTIONS
ENV NODE_OPTIONS="--require ./.pnp.cjs"

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
