# UrbanPulse Adapter 🔌

This service is an adapter for the UrbanPulse instance.

## Requirements

+ Node.js 14.16.x
+ A running `resource-management`
+ A running UrbanPulse instance

## Environment Variables

| Name                  | default                | description                                           |
|-----------------------|------------------------|-------------------------------------------------------|
| NODE_ENV              | development            | sets the mode in which the service runs               |
| PORT                  | 4003                   | port on which the API runs                            |
| ENTITY_MANAGEMENT_URL | https://localhost:3000 | endpoint where the `resource-management` is available |
| CORS_ALLOW_ORIGIN     | *                      | CORS allowed origin                                   |

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
## License

Copyright © Fraunhofer ISST 2022
