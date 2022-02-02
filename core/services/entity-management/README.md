# Resource Management 🏭

The `resource-management` is responsible for managing the metadata about so called resources. A resource can be a `file`, a sensor from some kind (e.g `urbanPulseSensor`) or in future releases a database or API.

## Requirements

+ Node.js 14.16.x
+ Running the `documentstore` (`mongoDb`)
+ A running `kafka` broker with `zookeeper` (containing the topic `resource.events`)
+ A running `schema-registry` for fetching the needed schemata

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|3000|sets the port allocated by the service|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_DB_NAME|resourcesDb|MongoDB database name for resources|
|MONGO_COLLECTION_NAME|resources|MongoDB collection name for resources|
|HISTORY_DB_NAME|historiesDb|MongoDB database name for histories|
|HISTORY_COLLECTION_NAME|histories|MongoDB collection name for histories|
|KAFKA_URL|broker:9092||
|KAFKA_EVENT_TOPIC|resource.events|topic to which resource events should be published|
|SCHEMA_REGISTRY_URL|http://localhost:3010/|URL of the schema registry where the `resource` JSON schema and `asyncapi` schema is located|
|RESOURCE_ROOT_SCHEMA|resource|name of the `resource` root schema to be loaded|
|HISTORY_ROOT_SCHEMA|history|name of the `history` root schema to be loaded|
|ASYNCAPI_SPECIFICATION|asyncapi|name of the `asyncapi` schema to be loaded|

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
docker-compose pull resource-management
```

Build the image:

```sh
docker-compose build resource-management
```

Run the container:

```sh
docker-compose up -d resource-management
```

Push the image:

```sh
docker-compose push resource-management
```

## Use

Please take a look into the [OpenAPI Specification](./apiDoc/openapi.yml).

## License

Copyright © Fraunhofer ISST 2021
