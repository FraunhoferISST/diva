FROM node:16.14.0-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm config set update-notifier false
RUN npm install --production

COPY . .

CMD ["npm", "run", "start"]
