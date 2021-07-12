# UrbanPulse Adapter 🔌

This service is an adapter for the UrbanPulse instance.

## Requirements

+ Node.js 14.16.x
+ A running `resource-management`
+ A running UrbanPulse instance

## Environment Variables

|Name|default|description|
|---|---|---|
|NODE_ENV|development|sets the mode in which the service runs|
|PORT|4003|port on which the API runs|
|RESOURCE_MANAGEMENT_URL|https://localhost:3000|endpoint where the `resource-management` is available|
|ASSET_MANAGEMENT_URL|https://localhost:3002|endpoint where the `asset-management` is available|

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
