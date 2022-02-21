# Business Decision Point

The service holds policies and business rules and acts as the point to enforce system-wide policies and provide actions 
according to business rules.

## Requirements

+ Node.js v16.14.x

## Environment variables

The following environment variables can be passed to the service through deployment:

| name                        | default                                                                                 | description                                                                                 |
|-----------------------------|-----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| BUSINESS_DECISION_POINT_URL | http://localhost:3001/                                                                  | The URL of the Business Decision Point service                                              |
| SERVICES_URLS               | "datanetwork-assistant::http://localhost:3012,entity-management::http://localhost:3000" | The mapping of the services names to corresponding URLs were the services can be reached on |
| CORS_ALLOW_ORIGIN           | *                                                                                       | CORS allowed origins                                                                        |
| PORT                        | 3001                                                                                    | port to be exposed by the service                                                           |

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
docker-compose pull business-descion-point
```

Build the image:

```sh
docker-compose build business-descion-point
```

Run the container:

```sh
docker-compose up -d business-descion-point
```

Push the image:

```sh
docker-compose push business-descion-point
```

## License

Copyright © Fraunhofer ISST 2022
