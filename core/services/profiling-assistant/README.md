# Profiling Assistant 🛠️

This service provides a way of triggering `airflow:2.x` workflows.

## Requirements

+ Node.js v14.16.x

+ Running instance of Airflow 2

## Environment Variables

| ENV Name                   | Default                               | Description                                   |
|----------------------------|---------------------------------------|-----------------------------------------------|
| NODE_ENV                   | development                           | Set to *production* in production environment |
| PORT                       | 3011                                  | Can be changed to your needs                  |
| AIRFLOW_URL                | http://localhost:9090                 | Endpoint where your `Airflow` instance lives  |
| _AIRFLOW_WWW_USER_USERNAME | airflow                               | Airflow username for login                    |
| _AIRFLOW_WWW_USER_PASSWORD | airflow                               | Airflow password for login                    |
| MONGODB_URI                | mongodb://admin:admin@localhost:27017 | MongoDB connection URI                        |

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
