FROM node:14.15.1-alpine

ARG proxy
ARG sproxy
ARG noproxy

ENV http_proxy="$proxy"
ENV https_proxy="$sproxy"
ENV no_proxy="$noproxy"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD npm run start
