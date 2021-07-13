# Docker Compose up and running

All system components are containerized and in this guide we will learn how to get DIVA running with `docker-compose`. 
You will find more details in the official documentation.

## Requirements

- Docker 20.10.x
- Docker Compose 1.28.x

## Spin of the system

We have prepared a script which you can use to directly boot all components, with default environment setup. 
If you need a quick start, just execute the following commands:

```sh
# navigate to docker/ directory
cd docker
# spin up the system
./up_core.sh
```

The script starts all core services, profiling workflow engine, DSC and the web client application. It may take some 
time until all components are up and running. By default, the client should be available on `localhost:80`.

## Container and images management

This chapter is interesting for those who want to actively participate in the development of the system or manage 
containers and images in a more granular way. We will take a brief look at how to build, push, and pull images in general.

First of all, it is important to create the `.env` file with necessary configuration:

```sh
cp .env.default .env
```
In `.env` you can flexibly adjust the environment to your needs.


### Manage microservices

All microservices and their dependencies are defined `docker-compose.yml`. You will work with this file the most. 

**Pull image**

Simply run the command:

```sh
docker-compose pull <service_name>
# for example
docker-compose pull user-management
```

**Build image**

To explicitly build the image from source, specify the path to the build `.yml` :

```sh
docker-compose f docker-compose.yml -f docker-compose.build.yml build <service_name>
# for example
docker-compose f docker-compose.yml -f docker-compose.build.yml build user-management
```

**Push image**

Push image to container registry:

```sh
docker-compose push <service_name>
# for example
docker-compose push user-management
```

### Manage FaaS

All FaaS are defined `docker-compose.faas.yml`.

**Pull image**

```sh
docker-compose -f docker-compose.faas.yml pull <service_name>
# for example
docker-compose -f docker-compose.faas.yml pull text-keywords-extractor
```

**Build image**

To explicitly build the image from source, specify the path to the build `.yml` :

```sh
docker-compose -f docker-compose.faas.yml -f docker-compose.faas.build.yml build <service_name>
# for example
docker-compose -f docker-compose.faas.yml -f docker-compose.faas.build.yml build text-keywords-extractor
```

**Push image**

Push image to container registry:

```sh
docker-compose -f docker-compose.faas.yml push text-keywords-extractor
# for example
docker-compose -f docker-compose.faas.yml push text-keywords-extractor
```

### Manage Airflow

We use a slightly customized image for Airflow. The definitions for Airflow
are specified in`docker-compose.airflow.yml`.

**Pull image**

```sh
docker pull ghcr.io/fraunhoferisst/diva/airflow:<version>
```

**Build image**

To explicitly build the image from source, specify the path to the build `.yml` :

```sh
docker-compose -f docker-compose.airflow.build.yml build airflow
```

**Push image**

Push image to container registry:

```sh
docker-compose -f docker-compose.airflow.yml push airflow
```

### Manage base images

We have several images that serve as the basis for our FaaS. They are located in `./base-images`, so first
change the working directory:

```sh
cd base-images
```
**Pull image**

```sh
docker-compose pull <service_name>
# for example
docker-compose pull base-python3
```

**Build image**

To explicitly build the image from source, specify the path to the build `.yml` :

```sh
docker-compose build <service_name>
# for example
docker-compose build base-python3
```

**Push image**

Push image to container registry:

```sh
docker-compose push <service_name>
# for example
docker-compose push base-python3
```