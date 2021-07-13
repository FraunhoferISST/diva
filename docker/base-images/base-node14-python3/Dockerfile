FROM node:14.16.0-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

# See https://github.com/docker-library/openjdk/blob/b4f29ba829765552239bd18f272fcdaf09eca259/8-jre/alpine/Dockerfile
RUN apk upgrade --update && \
    apk add ca-certificates \
            gcc \
            g++ \
            gnupg \
            libffi-dev \
            make \
            python3-dev && \
            python3 -m ensurepip && \
            rm -r /usr/lib/python*/ensurepip && \
            pip3 install --upgrade pip setuptools && \
            if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
            if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
            rm -r /root/.cache
