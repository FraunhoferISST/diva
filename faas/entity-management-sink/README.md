# Resource Management Sink 🛀

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Fentity-management-sink%2Fpackage.json)

A simple service to PATCH workflow results in our `entity-management`.

## Accepted MIME Types

+ `application/json`

## Configuration

Environment variables:

|Name|Default|Description|
|---|---|---|
INPUT_FILE | --- | a path to the file to be loaded and PATCHED
ENTITY_MANAGEMENT_URL | localhost:3000 | endpoint where the `entity-management` is located|
ACTOR_ID |---| id of the actor that triggered the profiling
ENTITY_ID |---| id of the `entity` to be updated

## Local Development

### Requirements

+ Node.js 19.4.x
+ running `entity-management`

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

Copyright © Fraunhofer ISST 2023
