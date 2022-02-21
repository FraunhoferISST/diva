# Business Rules Executor 📈

The service consumes all system events and executes matching business rules.

## Requirements

+ Node.js v16.14.x

## Environment variables

The following environment variables can be passed to the service through deployment:

| name                        | default                | description                                    |
|-----------------------------|------------------------|------------------------------------------------|
| BUSINESS_DECISION_POINT_URL | http://localhost:3001/ | The URL of the Business Decision Point service |

## Setting up for Development

### Local

Install dependencies:

```sh
npm i
```

Start the service:

```sh
npm run start
```

### Docker

Use docker-compose to start the service in a container, build new service image and push the image to the GitHub docker registry.

Pull the image:

```sh
docker-compose pull business-rules-executor
```

Build the image:

```sh
docker-compose build business-rules-executor
```

Run the container:

```sh
docker-compose up -d business-rules-executor
```

Push the image:

```sh
docker-compose push business-rules-executor
```

## License

Copyright © Fraunhofer ISST 2022
