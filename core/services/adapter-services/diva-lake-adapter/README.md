# DIVA Lake Adapter 🌊

This service is responsible for uploading files into our `diva-lake` and create a related resource in our `resource-management`. API documentation can be found in our [OpenApi Specification](apiDoc/openapi.yml).

## Requirements

+ Node.js 14.16.x

## Environment Variables

Following ENV variables can be set to configure the `diva-lake-adapter`.

| Name                  | default               | description                             |
|-----------------------|-----------------------|-----------------------------------------|
| NODE_ENV              | development           | sets the mode in which the service runs |
| PORT                  | 4001                  | sets the port allocated by the service  |
| ENTITY_MANAGEMENT_URL | localhost:3000        | set `resource-management` host          |
| DIVA_LAKE_HOST        | localhost             | host where the `diva-lake` lives        |
| DIVA_LAKE_PORT        | 9000                  | port of the diva lake                   |
| DIVA_LAKE_USERNAME    | minio_access          | login username of `diva-lake`           |
| DIVA_LAKE_PASSWORD    | minio_secret          | login password of `diva-lake`           |
| BUCKET_NAME           | file-lake             | bucket, where files are getting stored  |
| SCHEMA_REGISTRY_URL   | http://localhost:3010 | Schema Registry URL                     |
| CORS_ALLOW_ORIGIN     | http://localhost:3010 | CORS allowed origins                    |

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
docker-compose pull diva-lake-adapter:x.x.x
```

Build the image:

```sh
docker-compose build diva-lake-adapter:x.x.x
```

Run the container:

```sh
docker-compose up -d diva-lake-adapter:x.x.x
```

Push the image:

```sh
docker-compose push diva-lake-adapter:x.x.x
```

## License

Copyright © Fraunhofer ISST 2022
