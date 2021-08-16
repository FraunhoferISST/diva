# DIVA Core User Management Service

User Management exposes a REST API for CRUD operations on users and user images.
The authentication of the user happens through Keycloak. The synchronization of the user data created through Keycloak
happens on PUT endpoint where the Keycloak user are extended with the attributes corresponding to users schema
The OpenAPI 3.0 specification can be found in [apiDoc/openAPI.yml](./apiDoc/openapi.yml).

## Requirements

+ Node.js v14

## Environment variables

The following environment variables can be passed to the service through deployment:

| name | default  |
|---|---|
| port  | 3001  |
| MONGO_URI | mongodb://admin:admin@localhost:27017|
| MONGO_DB_NAME | usersDb |
| MONGO_COLLECTION_NAME | users |
| HISTORY_DB_NAME | historiesDb |
| HISTORY_COLLECTION_NAME | histories |
| CORS_ALLOW_ORIGIN  | * |
| SCHEMA_REGISTRY_URL  | http://localhost:3010 |
| KAFKA_URL  | broker:9092 |
| KAFKA_EVENT_TOPIC  | user.events |
| USER_ROOT_SCHEMA  | user |
| HISTORY_ROOT_SCHEMA  | history |

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

### Tests

The e2e tests require a running MongoDB instance. We reuse the same instance in the development and testing environments.
So make sure that you run the tests in the `NODE_ENV=test` mode. It is best to use the predefined npm scripts:

```sh
# e2e test
npm run test:e2e
# unit tests
npm run test:unit
```

### Docker

Use docker-compose to start the service in a container, build new service image and push the image to the GitHub container registry.

Pull the image:

```sh
docker-compose pull usermanagement
```

Build the image:

```sh
docker-compose build usermanagement
```

Run the container:

```sh
docker-compose up -d usermanagement
```

Push the image:

```sh
docker-compose push usermanagement
```

## License

Copyright © Fraunhofer ISST 2021
