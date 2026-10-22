FROM node:20-alpine AS build

WORKDIR /app

# Copy root and workspace package files
COPY package.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies and build client
RUN npm --prefix client install
COPY client/ ./client/
RUN npm --prefix client run build

# Install server dependencies
RUN npm --prefix server install --omit=dev
COPY server/ ./server/

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

COPY --from=build /app/package.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/index.js"]
