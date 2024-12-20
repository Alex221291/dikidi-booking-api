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

RUN apk add --no-cache openssl

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY ./prisma ./prisma

RUN npm install prisma

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
