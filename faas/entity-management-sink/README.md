# Resource Management Sink 🛀

[![version](https://img.shields.io/badge/resource--management--sink-1.0.1-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/resource-management-sink)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/resource-management-sink/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/resource-management-sink/-/commits/master)

A simple service to PATCH workflow results in our `resource-management`.

## Accepted MIME Types

+ `application/json`

## Configuration

Environment variables:

|Name|Default|Description|
|---|---|---|
INPUT_FILE | --- | a path to the file to be loaded and PATCHED
RESOURCE_MANAGEMENT_URL | localhost:3000 | endpoint where the `resource-management` is located|
ACTOR_ID |---| id  of the actor that triggered the profiling
RESOURCE_ID |---| id of the `resource` to be updated

## Local Development

### Requirements

+ Node.js 14.16.x
+ running `resource-management`

### Dependencies

```sh
npm i
```

### Run

```sh
# if environment ist defined in IDE
npm run start

# manually set ENV variables like this
INPUT_FILE=./test.txt node app.js
```

## License

Copyright © Fraunhofer ISST 2021
