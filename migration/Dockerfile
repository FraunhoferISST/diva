FROM node:14.16.0-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV=production
COPY *.json ./
RUN npm ci --production --no-optional
COPY . .

CMD ["npm", "run", "migrate"]

