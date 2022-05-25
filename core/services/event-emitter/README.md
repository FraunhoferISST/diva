# Event Emitter Service 📠

This service provides an event channel based on Websockets. It informs the connected clients about new available data for
existing entities and other important events.

## Requirements

+ Node.js 14.16.x

## Environment Variables

| Name                        | default                                  | description                                                       |
|-----------------------------|------------------------------------------|-------------------------------------------------------------------|
| NODE_ENV                    | development                              | sets the mode in which the service runs                           |
| PORT                        | 3009                                     | sets the port allocated by the service                            |
| SCHEMA_REGISTRY_URL         | <http://localhost:3010/>                 | URL of the schema registry where the `asyncapi` schema is located |
| KAFKA_URL                   | <broker:9092>                            | Where the Kafka broker is located to read events from             |
| KAFKA_TOPICS                | `["entity.events", "datanetwork.events"] | Which topics should be read to send events to client              |
| EVENT_EMITTER_SPECIFICATION | event-emitter-api                        | Which topics should be read to send events to client              |
| ASYNCAPI_SPECIFICATION      | asyncapi                                 | Which topics should be read to send events to client              |

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
docker-compose pull event-emitter:x.x.x
```

Build the image:

```sh
docker-compose build event-emitter:x.x.x
```

Run the container:

```sh
docker-compose up -d event-emitter:x.x.x
```

Push the image:

```sh
docker-compose push event-emitter:x.x.x
```

## Use

Connect to the `Socket.io` connection using your favorite tool (e.g. `Hoppscotch`) or library (`socket.io:^4.0.0`).
You can subscribe and unsubscribe to/from specific entity events. Message API is specified in the `event-emitter-api` 
schema which can be requested by our `Schema Registry Service`.

## License

Copyright © Fraunhofer ISST 2022
