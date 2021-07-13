<div align="center" style="text-align: center;">
  <img src="https://owncloud.fraunhofer.de/index.php/s/aAuhMQl4gNiFDsa/download" />
</div>
<!-- START TOP README -->
<h1 align="center">DIVA - Data Inventory and Valuation Approach 📚</h1>

[![version](https://img.shields.io/badge/diva-v2.1.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/drm)

<div align="center">
  <h2>📡⚗🧪🧬</h2>
</div>
<div align="center">
  <strong>An awesome data catalog application</strong>
</div>
<div align="center">
  Developed for evaluating the newest data management technologies in context of data transparency, data insight and data networking
</div>

<br />

<div align="center" style="text-align: center;">
    <img src="https://owncloud.fraunhofer.de/index.php/s/YxWE4J5VWYODo2p/download" alt="Diva slide screenshot" width="850"/>
</div>

<!-- END TOP README -->

<!-- START TABLE OF CONTENT -->
## Table of Contents

- [Motivation](#motivation)
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies and Frameworks used](#technologies-and-frameworks-used)
- [Quick start](#quick-start)

<!-- END TABLE OF CONTENT -->

## Motivation

This is an ongoing project of the _Digitization in Service Industries_ department of the **Fraunhofer ISST**. Data is getting more and more important to companies. By utilizing the right data, companies can get more productive and will be able to succeed their competitors. Thus, we believe it is time for a data management solution, that evaluates new innovative solutions to support companies in their daily work with data. This tool will grow day by day and we try our best to tackle data management challenges in companies.

We also use this tool as a playground for our students, where they can work out topics for their **bachelor** or **master thesis**. Even the PhD students profit from this tool as a platform for their **doctoral thesis**.

## Features

- __🏛️__ __microservice architecture:__ allows to choose the best technology for solving a problem and a more easy scaling

- __💻__ __client application:__ an easy to use web application for managing all kinds of data management related topics

- __🖥️__ __portal application:__ simple search for interesting files on different devices (**WIP**)

- __🐳__ __docker ready:__ all microservices and core components are docker ready so you can start them right out of the box.

## Technologies and Frameworks used

|Technology|Description|
|----------|-------------|
|[VueJS 2](https://vuejs.org/)|component based frontend solution for building robust apps|
|[Vuetify](https://vuetifyjs.com/en/)|makes frontend beautiful|
|[Kong](https://konghq.com/)|our API gateway that we use to route microservices|
|[Kafka](https://kafka.apache.org/)|message log for microservice communication|
|[node.js](https://nodejs.org/en/)|nice JavaScript platform for running server apps|
|[Express Framework](https://expressjs.com/)|helps us building simple microservices|
|[Apache Tika](https://tika.apache.org/)|if you need to take a look into heterogenous data, Tika is your solution|
|[Python3](https://www.python.org/)|helps us doing data science and NLP (natural language processing)|
|[Electron](https://electronjs.org/)|building desktop applications for Windows, OSX and Linux|
|[Docker](https://www.docker.com/)|building and publishing images|
|[Kubernetes](https://kubernetes.io/de/)|production-grade container orchestration|
|[Airflow](https://airflow.apache.org/)|author, schedule and monitor workflows|
|[OpenAPI](https://www.openapis.org/)|specification language to describe the HTTP APIs of our microservices|
|[AsyncAPI](https://www.asyncapi.com/)|specification language to describe how `Kafka` and `WebSocket` messages look|
|[JSON Schema](https://json-schema.org/)|specification language to describe how an entity is build|
|[MongoDB](https://github.com/mongodb/mongo)|our main document store that is the single source of truth when it comes to metadata|
|[Elasticsearch](https://www.elastic.co/de/elasticsearch/)|our search index used to search for entities and make interesting aggregations|
|[Kibana](https://www.elastic.co/de/kibana)|our window into `elasticsearch` for debugging|
|[MinIO](https://min.io/)|our object store to save files uploaded by browser (aka `diva-lake`)|
|[DataspaceConnector](https://www.dataspace-connector.io/)|our connection to the world of secure and sovereign data exchange|

## Quick start

> ⚠️ 
> The project is currently being migrated to GitHub and we are in the reconstruction phase.
> In parallel, we are putting a lot of effort into writing a comprehensive documentation for DIVA.
> But this will also take some time. Currently, this is the only piece of information we can provide

 The whole system can be bootstrapped with Docker:
```sh
cd docker
# create .env and copy contents from .env.default to it
cp .env.default .env
# execute the script to boot all necessary components
./up_core.sh
```

## Credits

This project is developed by employees of Fraunhofer ISST. They put all their ❤ into this project to try out the latest **cutting edge** technologies.

||||||
|:---:|:---:|:---:|:---:|:---:|
| **Daniel Tebernum** <br><br> [![Daniel Tebernum](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3566/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dtebernum) | **Sergej Atamantschuk** <br><br> [![Sergej Atamantschuk](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3617/avatar.png?width=400)](https://github.com/Igelex) | **Dustin Chabrowski** <br><br> [![Dustin Chabrowski](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3563/avatar.png?width=400)](https://github.com/Duske) | **Julia Pampus** <br><br> [![Julia Pampus](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/4688/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/jpampus) | **Marcel Altendeitering** <br><br> [![Marcel Altendeitering](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3589/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/maltendeitering) |
| **Josef Schneider** <br><br> [![Josef Schneider](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3735/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/jschneider) | **Andreas Roth** <br><br> [![Andreas Roth](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3744/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/aroth) |

## License
Copyright © Fraunhofer ISST 2021
