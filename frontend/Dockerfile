# Use Node.js image
FROM node:22-slim AS deps
WORKDIR /app

# Install dependencies only
COPY frontend/package*.json ./
RUN npm install

# Build the app
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN npm run build

# Debugging
RUN ls -la /app/.next

# Production image
FROM node:22-slim AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Debugging
RUN ls -la ./.next

EXPOSE 3000

CMD ["npm", "start"]