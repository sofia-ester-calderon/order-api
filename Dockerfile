FROM node:7.7.2-alpine

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .