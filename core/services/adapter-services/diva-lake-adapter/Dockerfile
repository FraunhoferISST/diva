# Buld service binary
FROM node:14.16.0-alpine as builder
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva
ARG SERVICE_NAME="adapter-services/diva-lake-adapter"

RUN mkdir -p /usr/src
WORKDIR /usr/src/

ENV NODE_ENV=production

COPY services/common ./services/common
COPY services/eslint-config ./services/eslint-config
COPY services/$SERVICE_NAME ./services/$SERVICE_NAME
COPY *.json ./

RUN npm ci --ignore-scripts --production --no-optional
RUN npx lerna bootstrap --hoist --ignore-scripts -- --production --no-optional
RUN npm run build:alpine --prefix services/$SERVICE_NAME

# Execute binary
FROM alpine:3.14.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva
ARG SERVICE_NAME="adapter-services/diva-lake-adapter"

RUN mkdir -p /app
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /usr/src/services/$SERVICE_NAME/index-alpine /app/index-alpine

EXPOSE 4001

CMD ["/app/index-alpine"]

