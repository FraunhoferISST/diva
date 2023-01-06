#!/bin/sh
echo "Starting migration..."
ENV_FILE=.env
if test -f "$ENV_FILE"; then
    echo "using $ENV_FILE"
else
  ENV_FILE=.env.default
  echo "using $ENV_FILE"
fi
docker compose -f docker-compose.migration.yml --env-file $ENV_FILE up migration
