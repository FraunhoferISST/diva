# Profiling Assistant 🛠️

This service provides a way of triggering `airflow:1.10` workflows.

## Requirements

+ `nodejs:14.16.x`

+ running instance of `airflow:1.10`

## Environment Variables

|ENV Name|Default|Description|
|---|---|---|
|NODE_ENV|development|Set to *production* in production environment|
|PORT|3011|Can be changed to your needs|
|AIRFLOW_URL|http://localhost:9090|Endpoint where your `Airflow` instance lives|
|MONGODB_URI|mongodb://admin:admin@localhost:27017|MongoDB connection URI|
|MONGO_RESOURCE_DB_NAME|resourcesDb|database name for resources|
|MONGO_RESOURCE_COLLECTION_NAME|resources|collection name for resources|

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
