FROM node:14.16.0-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

# See https://github.com/docker-library/openjdk/blob/b4f29ba829765552239bd18f272fcdaf09eca259/8-jre/alpine/Dockerfile
RUN apk upgrade --update && \
    apk add openjdk8-jre
