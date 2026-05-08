FROM node:20-alpine

# Create non-root user (fix permission denied errors)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create directories & set permissions
RUN mkdir -p /app/data/project /app/models /app/sandbox /app/logs && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/status || exit 1

CMD ["node", "ionclaw-server/index.js"]
