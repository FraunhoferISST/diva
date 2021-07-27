# Buld service binary
FROM node:14.16.0-alpine as builder
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva
ARG SERVICE_NAME=schema-registry

RUN mkdir -p /usr/src
WORKDIR /usr/src/

ENV NODE_ENV=production

COPY services/common ./services/common
COPY services/eslint-config ./services/eslint-config
COPY schemata ./services/$SERVICE_NAME/
COPY services/$SERVICE_NAME ./services/$SERVICE_NAME
COPY *.json ./


# Execute binary
FROM alpine:3.14.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva
ARG SERVICE_NAME=schema-registry

RUN mkdir -p /app
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /usr/src/services/$SERVICE_NAME/** .
RUN ls

EXPOSE 3010

CMD ["/app/index-alpine"]

