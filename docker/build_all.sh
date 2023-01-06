#!/bin/sh

# ####################################################################################################################
# The script builds all possibly images
# Use this script only in case of last urgency! The execution may take a few hours!!!
# ####################################################################################################################

echo "Building ..."
echo "\n"
ENV_FILE=.env
if test -f "$ENV_FILE"; then
    echo "using $ENV_FILE"
else
  ENV_FILE=.env.default
  echo "using $ENV_FILE"
fi
echo "\n"
docker compose -f docker-compose.override.yml --env-file $ENV_FILE build --parallel
docker compose -f base-images/docker-compose.yml build --parallel
docker compose -f docker-compose.faas.yml -f docker-compose.faas.override.yml --env-file $ENV_FILE build --parallel
docker compose -f docker-compose.airflow.yml build --env-file $ENV_FILE build --parallel
