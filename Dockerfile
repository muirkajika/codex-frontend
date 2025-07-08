# ---- Dependencies Stage ----
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# ---- Builder Stage ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Pass the API URL as a build argument
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN npm run build

# ---- Production Runner Stage ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Create a non-root user for security before copying files
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output which contains the server and minimal node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy the public and static folders into the standalone folder for serving
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# The command to start the server from within the standalone context
CMD ["node", "server.js"]
