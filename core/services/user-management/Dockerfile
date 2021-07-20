FROM node:14.15.1-alpine
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /usr/src
WORKDIR /usr/src/

ENV NODE_ENV=production

COPY services/common ./services/common
COPY services/user-management ./services/user-management
COPY *.json ./

RUN npm ci --ignore-scripts --production --no-optional
RUN npx lerna bootstrap --hoist --ignore-scripts -- --production --no-optional

EXPOSE 3001

# CMD npx lerna run start --scope=user-management
CMD npm run start --prefix services/user-management