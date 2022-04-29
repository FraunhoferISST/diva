# Entity Management 🏭

The service is responsible for managing the metadata about entities.

## Requirements

+ Node.js 14.16.x
+ Running the `documentstore` (`mongoDb`)
+ A running `kafka` broker with `zookeeper` (containing the topic `entity.events`)
+ A running `schema-registry` for fetching the needed schemata

## Environment Variables

| Name                | default                               | description                                                                                 |
|---------------------|---------------------------------------|---------------------------------------------------------------------------------------------|
| NODE_ENV            | development                           | sets the mode in which the service runs                                                     |
| PORT                | 3000                                  | sets the port allocated by the service                                                      |
| MONGODB_URI         | mongodb://admin:admin@localhost:27017 | MongoDB connection URI                                                                      |
| KAFKA_URL           | broker:9092                           |                                                                                             |

## Setting up for Development

### Local

Install dependencies:

```sh
npm i
```

Start the service:

```sh
npm run dev
```

### Docker

Use docker-compose to start the service in a container, build new service image and push the image to the GitLab docker registry.

Pull the image:

```sh
docker-compose pull entity-management
```

Build the image:

```sh
docker-compose build entity-management
```

Run the container:

```sh
docker-compose up -d entity-management
```

Push the image:

```sh
docker-compose push entity-management
```

## Use

Please take a look into the [OpenAPI Specification](./apiDoc/openapi.yml).

## License

Copyright © Fraunhofer ISST 2022
