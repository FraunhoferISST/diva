# Stage 1
FROM node:14.16.0-alpine as builder
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV="production"
RUN npm run build

# Stage 2
FROM nginx:1.17-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /static_files
WORKDIR /static_files

COPY --from=builder /app/dist .

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
