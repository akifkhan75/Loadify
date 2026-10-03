FROM node:18-alpine AS base

FROM base AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/ ./packages/
RUN pnpm install
COPY apps/api ./apps/api
# Generate prisma
RUN cd apps/api && pnpm dlx prisma generate
RUN pnpm turbo run build --filter=api...

FROM base AS runner
WORKDIR /app
RUN npm install -g pnpm
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma

EXPOSE 3000
CMD ["node", "dist/main.js"]
