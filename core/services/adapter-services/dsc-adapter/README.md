# IDS Adapter 🔌

This service is an adapter for the [Data Space Connector](https://github.com/International-Data-Spaces-Association/DataspaceConnector).
It listens in our `resource.events` topic for changes and forwards them to the Data Space Connector. 

## Requirements

+ Node.js 14.16.x
+ A running `data-space-connector:4.x`
+ A running `kafka` broker with `zookeeper`
+ `resource-management` that populates events

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|SCHEMA_REGISTRY_URL|<http://localhost:3010/>|URL of the schema registry where the `asset` JSON schema and `asyncapi` schema is located|
|ASYNCAPI_SPECIFICATION|asyncapi|name of the `asyncapi` schema to be loaded|
|KAFKA_URL|<broker:9092>|where the Kafka broker is located to read events from|
|KAFKA_EVENT_TOPICS|`[resource.events]`|topic to which asset events should be published|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_RESOURCE_DB_NAME|resourceDb|MongoDB database name of the resources|
|MONGO_RESOURCE_COLLECTION_NAME|resources|MongoDB collection name of the resources|
|RESOURCE_MANAGEMENT_URL|<https://localhost:3000>|endpoint where the `resource-management` is available|
|DSC_URL|https://localhost:7070|endpoint where the `data-space-connector` is available|
|DSC_USERNAME|admin|username for `data-space-connector` login|
|DSC_PASSWORD|password|password for `data-space-connector` login|

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
docker-compose pull ids-adapter
```

Build the image:

```sh
docker-compose build ids-adapter
```

Run the container:

```sh
docker-compose up -d ids-adapter
```

Push the image:

```sh
docker-compose push ids-adapter
```

## Use

There are no additional things that one can do. The service just forwards resources that should be published using the `data-space-connector:4.x`. In future, getting resources from the `data-space-connector` could be an option.

## License

Copyright © Fraunhofer ISST 2021
