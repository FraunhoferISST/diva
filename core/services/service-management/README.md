# Service Management Service 🏘️

This service handles so called `services`. It is responsible for CRUD operations on `services` entities.

## Requirements

+ Node.js 14.16.x

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|3004|sets the port allocated by the service|
|SCHEMA_REGISTRY_URL|<http://localhost:3010/>|URL of the schema registry where the `service` JSON schema and `asyncapi` schema is located|
|SERVICE_ROOT_SCHEMA|service|name of the `service` root schema to be loaded|
|ASYNCAPI_SPECIFICATION|asyncapi|name of the `asyncapi` schema to be loaded|
|KAFKA_URL|<broker:9092>|where the Kafka broker is located to read events from|
|KAFKA_EVENT_TOPIC|`service.events`|topic to which service events should be published|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_DB_NAME|servicesDb|MongoDB database name|
|MONGO_DB_COLLECTION_NAME|services|MongoDB collection name|
|MONGO_GFS_SERVICE_IMAGE_BUCKET_NAME|serviceImages|MongoDB bucket name for service images|
|HISTORY_DB_NAME|historiesDb|MongoDB database name for histories|
|HISTORY_COLLECTION_NAME|histories|MongoDB collection name for histories|
|HISTORY_ROOT_SCHEMA|history|name of the `history` root schema to be loaded|


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

Use docker-compose to start the service in a container, build new service image and push the image GitHub registry.

Pull the image:

```sh
docker-compose pull service-management
```

Build the image:

```sh
docker-compose build service-management
```

Run the container:

```sh
docker-compose up -d service-management
```

Push the image:

```sh
docker-compose push service-management
```

## License

Copyright © Fraunhofer ISST 2021
