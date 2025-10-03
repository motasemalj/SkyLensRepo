# Root-level Dockerfile that builds the frontend app

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app/frontend

ENV NPM_CONFIG_PRODUCTION=false
RUN apk add --no-cache libc6-compat

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps --include=dev

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app/frontend

# Accept build-time arguments from Railway
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_BASE_URL

# Set them as environment variables for the build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_IMAGE_BASE_URL=${NEXT_PUBLIC_IMAGE_BASE_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/frontend/node_modules ./node_modules
COPY frontend ./

# Debug: Print env vars during build to verify they're set
RUN echo "🔍 Build-time env check:" && \
    echo "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" && \
    echo "NEXT_PUBLIC_IMAGE_BASE_URL=${NEXT_PUBLIC_IMAGE_BASE_URL}"

RUN npm run build

# Debug: Verify what was embedded in the build
RUN grep -r "localhost:4001" .next/ || echo "✅ No localhost:4001 found in build"

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app/frontend
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json
COPY --from=builder /app/frontend/server.js ./server.js

USER nextjs
EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]


