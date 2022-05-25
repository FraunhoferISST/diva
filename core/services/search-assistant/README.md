# 🔍 Search Assistant

This service provides preselected search APIs against an *Elasticsearch 7.x* instance.

* currently, there is one global search endpoint

## Install

```
$ npm i
```

## Environment Variables
| ENV Name          | Default               | Description                                      |
|-------------------|-----------------------|--------------------------------------------------|
| NODE_ENV          | development           | Set to *production* in production environment    |
| PORT              | 3005                  | Can be changed to your needs                     |
| ELASTICSEARCH_URL | http://localhost:9200 | Endpoint where your Elasticsearch instance lives |
| CORS_ALLOW_ORIGIN | "*"                   | Set CORS origin                                  |

## Run Service

Do not forget to set environment variables if you need to change them!

### Local
```
npm run start
```

### Docker
1. Build Docker Image with: `docker build -t <image_name> .`
2. Run Container with: `docker run <image_name>`