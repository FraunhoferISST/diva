FROM alpine:3.12
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN apk upgrade --update && \
    apk add --no-cache \
    ca-certificates \
    gcc \
    g++ \
    gnupg \
    libffi-dev \
    libxml2-dev \
    libxslt-dev \
    make \
    python3-dev && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi && \
    rm -r /root/.cache

RUN pip3 install cffi && CFLAGS="-Wno-narrowing" pip3 install cld2-cffi