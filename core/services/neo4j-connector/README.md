
# Neo4J Connector 🔗

This service connects to an `neo4j` instance and transfers the metadata of our entities to create, update, and delete nodes. `DIVA` uses `neo4j` to store a so called datanetwork that interconnects metadata.

## Requirements

+ Node.js 14.16.x
+ A running `neo4j:4.3.7-community`
+ A running `kafka` broker with `zookeeper`
+ Other services that populate events (e.g. `resource-management`)

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|SCHEMA_REGISTRY_URL|<http://localhost:3010/>|URL of the schema registry where the `asset` JSON schema and `asyncapi` schema is located|
|ASYNCAPI_SPECIFICATION|asyncapi|name of the `asyncapi` schema to be loaded|
|KAFKA_URL|<broker:9092>|where the Kafka broker is located to read events from|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|

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

## Use

There are no additional things that one can do. The service is running completely on its own.

## License

Copyright © Fraunhofer ISST 2021
