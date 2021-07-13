FROM node:14.16.0-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

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

EXPOSE 6060

CMD npm run start
