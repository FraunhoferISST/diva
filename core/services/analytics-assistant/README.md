# DIVA Core Analytics Assistant 📈

User Management exposes a REST API for CRUD operations on users and user images and is responsible for
user authentication. The OpenAPI 3.0 specification can be found in [apiDoc/openapi.yml](./apiDoc/openapi.yml).

## Requirements

+ Node.js v14.16.x

## Environment variables

The following environment variables can be passed to the service through deployment:

| name              | default        | description                                         |
|-------------------|----------------|-----------------------------------------------------|
| PORT              | 3007           | port to be exposed by the `analytics-assistant`     |
| ELASTICSEARCH_URL | localhost:9200 | endpoint where to find the `elasticsearch` instance |
| CORS_ALLOW_ORIGIN | *              | CORS allowed origins                                |

## Setting up for Development

### Local

Install dependencies:

```sh
npm i
```

Start the service:

```sh
npm run start
```

### Docker

Use docker-compose to start the service in a container, build new service image and push the image to the GitLab docker registry.

Pull the image:

```sh
docker-compose pull analytics-assistant
```

Build the image:

```sh
docker-compose build analytics-assistant
```

Run the container:

```sh
docker-compose up -d analytics-assistant
```

Push the image:

```sh
docker-compose push analytics-assistant
```

## License

Copyright © Fraunhofer ISST 2021
