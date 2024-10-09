# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Run app
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 5000

CMD ["node", "dist/src/main"]