# DIVA Core History Assistant 🔁

History Assistant exposes a HTTP/REST API for receiving history data about an entity.
It also provides a human readable representation.
The OpenAPI 3.0 specification can be found in [apiDoc/openAPI.yml](./apiDoc/openapi.yml).

## Future Plans 🪐

+ build an entity object from the past by providing a history entry

## Requirements

+ Node.js v14.16.x

## Environment variables

The following environment variables can be passed to the service through deployment:

| name                | default                               | description                                                                                     |
|---------------------|---------------------------------------|-------------------------------------------------------------------------------------------------|
| PORT                | 3006                                  | set port, that this service exposes                                                             |
| MONGODB_URI         | mongodb://admin:admin@localhost:27017 | MongoDB connection URI                                                                          |
| SCHEMA_REGISTRY_URL | http://localhost:3010                 | MongoDB connection URI                                                                          |
| CORS_ALLOW_ORIGIN   | *                                     | set allowed origins                                                                             |
| IGNORE_FIELDS       | ["modified"]                          | fields to be ignored by the human readable output. To be added in dot notation e.g "ids.policy" |

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
docker-compose pull history-assistant
```

Build the image:

```sh
docker-compose build history-assistant
```

Run the container:

```sh
docker-compose up -d history-assistant
```

Push the image:

```sh
docker-compose push history-assistant
```

## License

Copyright © Fraunhofer ISST 2021
