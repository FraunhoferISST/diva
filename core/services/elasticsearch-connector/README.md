
# Elasticsearch Connector 🔗

This service connects to an `elasticsearch` instance and transfers the metadata of our entities. `DIVA` uses `elasticsearch` as search and analytics engine.

## Requirements

+ Node.js 14.16.x
+ A running `elasticsearch:7.10.x`
+ A running `neo4j`
+ A running `MongoDB`
+ A running `kafka` broker with `zookeeper`
+ Other services that populate events

## Environment Variables

| Name                   | default                               | description                                                                               |
|------------------------|---------------------------------------|-------------------------------------------------------------------------------------------|
| NODE_ENV               | development                           | sets the mode in which the service runs                                                   |
| SCHEMA_REGISTRY_URL    | <http://localhost:3010/>              | URL of the schema registry where the `asset` JSON schema and `asyncapi` schema is located |
| ASYNCAPI_SPECIFICATION | asyncapi                              | name of the `asyncapi` schema to be loaded                                                |
| KAFKA_URL              | <broker:9092>                         | where the Kafka broker is located to read events from                                     |
| MONGODB_URI            | mongodb://admin:admin@localhost:27017 | MongoDB connection URI                                                                    |
| NEO4J_URL              | bolt://localhost:7687                 | Neo4j connection URI                                                                      |
| NEO4J_ROOT_USERNAME    | neo4j                                 | Neo4j user                                                                                |
| NEO4J_ROOT_PASSWORD    | admin                                 | Neo4j password                                                                            |
| ELASTICSEARCH_URL      | http://localhost:9200                 | ES connection URL                                                                         |

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
docker-compose pull elasticsearch-connector
```

Build the image:

```sh
docker-compose build elasticsearch-connector
```

Run the container:

```sh
docker-compose up -d elasticsearch-connector
```

Push the image:

```sh
docker-compose push elasticsearch-connector
```

## Use

There are no additional things that one can do. The service is running completely on its own.

## License

Copyright © Fraunhofer ISST 2022
