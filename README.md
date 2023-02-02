<div align="center" style="text-align: center;">
  <img src="https://owncloud.fraunhofer.de/index.php/s/bzmjFRTJTlf9CUl/download" width="10%"/>
</div>
<!-- START TOP README -->
<h2 align="center">DIVA - Data Inventory and Valuation Approach</h1>
<div align="center">
  <strong>An awesome data catalog application</strong>
</div>
<div align="center">
  Developed for evaluating the newest data management technologies in context of data transparency, data insight and data networking
</div>
<br />

![GitHub](https://img.shields.io/badge/diva-v4.1.0-grün?style=flat-square)
![open issues](https://img.shields.io/github/issues/FraunhoferISST/diva?style=flat-square)
![license](https://img.shields.io/github/license/FraunhoferISST/diva?style=flat-square)
![code-size](https://img.shields.io/github/languages/code-size/FraunhoferISST/diva?style=flat-square)
![last-commit](https://img.shields.io/github/last-commit/FraunhoferISST/diva?style=flat-square)
<br />

<div align="center" style="text-align: center;">
    <img src="https://owncloud.fraunhofer.de/index.php/s/3yxR6feguuNiwkQ/download" alt="Diva slide screenshot" width="850"/>
</div>

<!-- END TOP README -->

<!-- START TABLE OF CONTENT -->
## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Technologies and Frameworks used](#technologies-and-frameworks-used)
- [Quick start](#quick-start)
- [Credits](#credits)
- [Documentation](https://fraunhoferisst.github.io/diva-docs/)

<!-- END TABLE OF CONTENT -->

## Motivation

This is an ongoing project of the _Digitization in Service Industries_ department of the **Fraunhofer ISST**. 
Data is getting more and more important to companies. By utilizing the right data, companies can get more productive and 
will be able to succeed their competitors. Thus, we believe it is time for a data management solution, that evaluates new 
innovative solutions to support companies in their daily work with data. This tool will grow day by day and we try our 
best to tackle data management challenges in companies.

We also use this tool as a playground for our students, where they can work out topics for their **bachelor** or **master thesis**. 
Even the PhD students profit from this tool as a platform for their **doctoral thesis**.

## Features

- __🏛️__ __microservice architecture:__ allows to choose the best technology for solving a problem and a more easy scaling

- __💻__ __client application:__ an easy to use web application for managing all kinds of data management related topics

- __🖥️__ __portal application:__ simple search for interesting files on different devices (**WIP**)

- __🐳__ __docker ready:__ all microservices and core components are docker ready so you can start them right out of the box.

## Core Technologies and Frameworks used

|Technology|Description|
|----------|-------------|
|[Kong](https://konghq.com/)|our API gateway that we use to route microservices|
|[Kafka](https://kafka.apache.org/)|message log for microservice communication|
|[node.js](https://nodejs.org/en/)|nice JavaScript platform for running server apps|
|[Express Framework](https://expressjs.com/)|helps us building simple microservices|
|[Docker](https://www.docker.com/)|building and publishing images|
|[Kubernetes](https://kubernetes.io/de/)|production-grade container orchestration|
|[Airflow](https://airflow.apache.org/)|author, schedule and monitor workflows|
|[OpenAPI](https://www.openapis.org/)|specification language to describe the HTTP APIs of our microservices|
|[AsyncAPI](https://www.asyncapi.com/)|specification language to describe how `Kafka` and `WebSocket` messages look|
|[JSON Schema](https://json-schema.org/)|specification language to describe how an entity is build|
|[MongoDB](https://github.com/mongodb/mongo)|our main document store that is the single source of truth when it comes to metadata|
|[Elasticsearch](https://www.elastic.co/de/elasticsearch/)|our search index used to search for entities and make interesting aggregations|
|[Keycloak](https://www.keycloak.org/)|Open Source Identity and Access Management|
|[MinIO](https://min.io/)|our object store to save files uploaded by browser (aka `diva-lake`)|
|[neo4j](https://neo4j.com/)|our graph database to store relations between entities more efficient|

## Other Technologies and Frameworks used

|Technology|Description|
|----------|-------------|
|[VueJS 2](https://vuejs.org/)|component based frontend solution for building robust apps|
|[Vuetify](https://vuetifyjs.com/en/)|makes frontend beautiful|
|[Apache Tika](https://tika.apache.org/)|if you need to take a look into heterogenous data, Tika is your solution|
|[Python3](https://www.python.org/)|helps us doing data science and NLP (natural language processing)|
|[Kibana](https://www.elastic.co/de/kibana)|our window into `elasticsearch` for debugging|
|[Filebeat](https://www.elastic.co/de/beats/filebeat)|fills elasticsearch with logs produced in our microservices|

## Quick start

The complete system can be quickly bootstrapped with Docker:
```sh
cd docker
# create .env and copy contents from .env.default to it
cp .env.default .env
# execute the script to boot all necessary components
./up_core.sh
```
To better prepare for the production environment, some system settings must be tweaked.
Follow our [documentation](https://fraunhoferisst.github.io/diva-docs/) to learn more about the configuration, concepts and the underlying architecture of DIVA!

## Credits

This project is developed by employees of [Fraunhofer ISST](https://www.isst.fraunhofer.de/). 
They put all their ❤ into this project to try out the latest **cutting edge** technologies.

### Active People

|**Daniel Tebernum** <br>(Lead)|**Sergej Atamantschuk** <br>(Lead)|**Anatoly Novohatny** <br><br>|**Janis Büse** <br><br>|
|:---:|:---:|:---:|:---:|
|[![Daniel Tebernum](https://avatars.githubusercontent.com/u/12967305?u=622c4a26340563d8675786b9b5358d6f5b88e2c7&v=4&s=128)](https://github.com/DaTebe) | [![Sergej Atamantschuk](https://avatars.githubusercontent.com/u/15034996?v=4&s=128)](https://github.com/setaman) | [![Anatoly Novohatny](https://avatars.githubusercontent.com/u/50167528?v=4&s=128)](https://github.com/anatoliynovo) | [![Janis Büse](https://avatars.githubusercontent.com/u/47151705?v=4&s=128)](https://github.com/jbuese)

|**Dustin Chabrowski** <br>(Alumni)<br>|**Marcel Altendeitering** <br>(Alumni)<br>|**Julia Pampus** <br>(Alumni)<br>|
|:---:|:---:|:---:|
|[![Dustin Chabrowski](https://avatars.githubusercontent.com/u/5938056?v=4&s=128)](https://github.com/Duske) | [![Marcel Altendeitering](https://avatars.githubusercontent.com/u/19547410?v=4&s=128)](https://github.com/maltendeitering) | [![Julia Pampus](https://avatars.githubusercontent.com/u/72392527?v=4&s=128)](https://github.com/juliapampus)

## License

Copyright © Fraunhofer ISST 2023
