# Stage 1
FROM node:10-alpine as build-step

RUN apk --no-cache add git

RUN apk --no-cache add bash

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build --prod

# Stage 2
FROM nginx:1.17.1-alpine

COPY --from=build-step /app/dist/network-diff-study-app /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
