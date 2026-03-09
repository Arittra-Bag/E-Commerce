FROM node:22-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source
COPY . .

# Build application
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 medusa

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=medusa:nodejs /app/.medusa/server ./.medusa/server
COPY --from=builder --chown=medusa:nodejs /app/medusa-config.ts ./medusa-config.ts

USER medusa

EXPOSE 9000

ENV PORT=9000

CMD ["npx", "medusa", "start"]
