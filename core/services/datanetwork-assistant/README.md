# Data Network Assistant 🛠️

This service provides a way of adding and deleting typed and directed edges in `neo4j`.

## Requirements

+ Node.js v14.16.x

+ Running instance of `neo4j:4.3.7-community`

## Environment Variables

|ENV Name|Default|Description|
|---|---|---|
|NODE_ENV|development|Set to *production* in production environment|
|PORT|3013|Can be changed to your needs|
|NEO4J_URL|bolt://neo4j:7687|Endpoint where your `neo4j` instance lives|
|NEO4J_ROOT_USERNAME|neo4j|`neo4j` username for login|
|NEO4J_ROOT_PASSWORD|admin|`neo4j` password for login|

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

Copyright © Fraunhofer ISST 2021
