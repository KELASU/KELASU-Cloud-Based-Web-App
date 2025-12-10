FROM node:20-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- ENVIRONMENT VARIABLES FOR BUILD ---
# These are required if your build process (SSG or Prisma) connects to services.
ARG DATABASE_URL
ARG GOOGLE_API_KEY

ENV DATABASE_URL=$DATABASE_URL
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client (Required if using Prisma)
# If you don't use Prisma, you can remove this line.
RUN npx prisma generate || true

# Build the Next.js application
RUN npm run build

# 3. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# This requires "output: 'standalone'" in next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# --- CRITICAL CONFIGURATION FOR CLOUD ---
# Listen on Port 80 by default (Matches Azure/AWS defaults)
ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# Note: Runtime secrets (DATABASE_URL, GOOGLE_API_KEY) should NOT be
# baked into the Dockerfile here. Set them in your Cloud Provider's
# Environment Variable settings (e.g., Azure App Service Configuration).

EXPOSE 80

CMD ["node", "server.js"]