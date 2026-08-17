# Multi-stage build for Node.js API
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install
COPY --from=builder /app/dist ./dist
COPY --from=builder ../scripts/migrate-db.sh ../scripts/migrate-db.sh
RUN chmod +x ../scripts/migrate-db.sh
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["npm", "run", "start:migrate"]
