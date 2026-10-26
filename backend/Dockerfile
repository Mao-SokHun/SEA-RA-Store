# ========================================================
# Stage 1: Build & Compile TypeScript
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy source code and config
COPY tsconfig.json ./
COPY src ./src/

# Generate Prisma Client & compile TypeScript to /app/dist
RUN npx prisma generate
RUN npm run build

# ========================================================
# Stage 2: Production Runtime
# ========================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install dumb-init for proper PID 1 signal forwarding
RUN apk add --no-cache dumb-init

# Copy package files and install production dependencies only
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && npx prisma generate

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads/payments uploads/accounts && chown -R node:node /app

# Run as non-root user for security
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
