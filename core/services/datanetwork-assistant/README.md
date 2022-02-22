# Data Network Assistant 🛠️

The service builds the representation and replication of the entities in a graph and provides an API to manage relations between them.
It reacts to the entities events and creates/deletes node in `neo4j`. Through the API these nodes can be further connected
to build meaningful entities relations graph. While publishing node events, the services propagates the event data of the 
origin entities events (e.g. `attributedTo`)

## Requirements

+ Node.js v14.16.x

+ Running instance of `neo4j:4.3.7-community`

## Environment Variables

| ENV Name            | Default             | Description                                   |
|---------------------|---------------------|-----------------------------------------------|
| NODE_ENV            | development         | Set to *production* in production environment |
| PORT                | 3012                | Can be changed to your needs                  |
| NEO4J_URL           | bolt://neo4j:7687   | Endpoint where your `neo4j` instance lives    |
| NEO4J_ROOT_USERNAME | neo4j               | `neo4j` username for login                    |
| NEO4J_ROOT_PASSWORD | admin               | `neo4j` password for login                    |
| SCHEMA_REGISTRY_URL | http:localhost/3010 | Schema Registry URL                           |
| CORS_ALLOW_ORIGIN   | *                   | CORS allowed origins                          |

## Run Service

Do not forget to set environment variables if you need to change them!

### Install Dependencies

```sh
npm i
```

### Local

```sh
npm run start
```

## License

Copyright © Fraunhofer ISST 2022
