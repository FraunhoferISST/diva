FROM ghcr.io/fraunhoferisst/diva/base-node14-java8:1.0.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production

COPY . .

CMD npm run start
