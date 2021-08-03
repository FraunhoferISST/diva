FROM ghcr.io/fraunhoferisst/diva/base-node14-python3:1.0.0
LABEL org.opencontainers.image.source=https://github.com/fraunhoferisst/diva

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
RUN pip install nltk && python -c "import nltk; nltk.download('punkt')"
COPY . .

CMD ["npm", "run", "start"]
