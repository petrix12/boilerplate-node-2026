FROM node:20-alpine AS base

WORKDIR /usr/src/app

# Dependencias para Prisma / OpenSSL en Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]