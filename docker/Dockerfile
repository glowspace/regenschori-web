# Image
FROM node:15.2-alpine

RUN apk update
# required for yarn install
RUN apk add git python
RUN apk add make g++

RUN yarn global add pm2 --prefix /usr/local

# Set up work directory
WORKDIR /var/www/html