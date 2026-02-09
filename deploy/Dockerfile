FROM node:16-alpine
WORKDIR /var/www/html
ENV HOST=0.0.0.0

RUN apk update
RUN apk add git python3 py3-pip make g++
RUN yarn global add pm2 --prefix /usr/local

COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
