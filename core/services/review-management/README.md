# Review Management Service

This service is responsible for CRUD operations on reviews and produces events on Kafka topic for all changes related
to reviews.

## Requirements

+ Node.js 14.15.x

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|3003|sets the port allocated by the service|
|SCHEMA_REGISTRY_URL|<http://localhost:3010/>|URL of the schema registry where the `asyncapi` schema is located|
|KAFKA_URL|<broker:9092>|where the Kafka broker is located to read events from|
|KAFKA_EVENT_TOPIC|`review.events`|topic to which reviews events should be published|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_DB_NAME|reviewsDb|MongoDB database name|
|MONGO_DB_COLLECTION_NAME|reviews|MongoDB collection name|

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
docker-compose pull review-management
```

Build the image:

```sh
docker-compose build review-management
```

Run the container:

```sh
docker-compose up -d review-management
```

Push the image:

```sh
docker-compose push review-management
```

## Use
Coming soon

## License

Copyright © Fraunhofer ISST 2021
