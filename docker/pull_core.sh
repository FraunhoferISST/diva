#!/bin/sh

echo "Pulling Core..."
echo "\n"
ENV_FILE=.env
if test -f "$ENV_FILE"; then
    echo "using $ENV_FILE"
else
  ENV_FILE=.env.default
  echo "using $ENV_FILE"
fi
echo "\n"
docker-compose -f docker-compose.yml --env-file $ENV_FILE pull
docker-compose -f docker-compose.dsc.yml --env-file $ENV_FILE pull
docker-compose -f docker-compose.airflow.yml --env-file $ENV_FILE pull
docker-compose -f docker-compose.profiling.yml --env-file $ENV_FILE pull
