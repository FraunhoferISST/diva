FROM node:14.16.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

CMD npm run start