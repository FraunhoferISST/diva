# Asset Management Service 🏘️

This service handles so called `assets`. An `asset` is a group of existing `entities` inside the `DIVA` system. For example if you have a collection of text documents regarding a certain project, you can bundle them inside an `asset`.

## Requirements

+ Node.js 14.16.x

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|3003|sets the port allocated by the service|
|SCHEMA_REGISTRY_URL|<http://localhost:3010/>|URL of the schema registry where the `asset` JSON schema and `asyncapi` schema is located|
|ASSET_ROOT_SCHEMA|asset|name of the `asset` root schema to be loaded|
|ASYNCAPI_SPECIFICATION|asyncapi|name of the `asyncapi` schema to be loaded|
|KAFKA_URL|<broker:9092>|where the Kafka broker is located to read events from|
|KAFKA_EVENT_TOPIC|`asset.events`|topic to which asset events should be published|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_DB_NAME|assetsDb|MongoDB database name|
|MONGO_DB_COLLECTION_NAME|assets|MongoDB collection name|
|MONGO_GFS_ASSET_IMAGE_BUCKET_NAME|assetImages|MongoDB bucket name for asset images|
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

Use docker-compose to start the service in a container, build new service image and push the image to the GitLab docker registry.

Pull the image:

```sh
docker-compose pull asset-management
```

Build the image:

```sh
docker-compose build asset-management
```

Run the container:

```sh
docker-compose up -d asset-management
```

Push the image:

```sh
docker-compose push asset-management
```

## Use

Coming soon

## License

Copyright © Fraunhofer ISST 2021
