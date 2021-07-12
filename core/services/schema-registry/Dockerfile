FROM node:14.15.1-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD npm run start
