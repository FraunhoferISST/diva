# Schema Registry 📔

This service provides a HTTP API to distribute file-based schemata. 

## Requirements

+ Node.js 14.16.x

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|3010|sets the port allocated by the service|
|SCHEMA_DIR|schemata|the folder, where all the schemata are located|

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
docker-compose pull schema-registry
```

Build the image:

```sh
docker-compose build schema-registry
```

Run the container:

```sh
docker-compose up -d schema-registry
```

Push the image:

```sh
docker-compose push schema-registry
```

## Use

Please take a look at the [openapi](./apiDoc/openapi.yml).

## License

Copyright © Fraunhofer ISST 2021