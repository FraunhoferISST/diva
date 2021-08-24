#!/bin/sh
DIST_FOLDER="dist"
CORE_FOLDER="core"
KONG_CONFIG_FOLDER="$CORE_FOLDER/kong-gateway"
ELASTICSEARCH_CONFIG_FOLDER="$CORE_FOLDER/elasticsearch"
AIRFLOW_BASE_FOLDER="$CORE_FOLDER/airflow"
SCHEMAS_FOLDER="$CORE_FOLDER/schemata"
KEYCLOAK_FOLDER="$CORE_FOLDER/keycloak"

echo "🏭 Building Distribution..."
rm -r "$DIST_FOLDER" # remove old dist if it exists
mkdir -p -- "$DIST_FOLDER" # create dist folder
mkdir -p -- "$DIST_FOLDER/docker-deployment" # create dist folder
mkdir -p -- "$DIST_FOLDER/docker-deployment/$CORE_FOLDER" # create core folder

echo "🐋 Building Docker Distribution..."

DOCKER_FOLDER="docker"
DOCKER_DIST_FOLDER="dist/docker-deployment"

cp -r "$DOCKER_FOLDER"* "$DOCKER_DIST_FOLDER/docker" # copy docker-compose files
rm -f "$DOCKER_DIST_FOLDER/docker/docker-compose.airflow.build.yml"
rm -f "$DOCKER_DIST_FOLDER/docker/docker-compose.monitoring.yml"
rm -f "$DOCKER_DIST_FOLDER/docker/build_all.sh"
rm -f "$DOCKER_DIST_FOLDER"/docker/*faas*
rm -f "$DOCKER_DIST_FOLDER/docker/docker-compose.override.yml" # remove override as it's only for local dev
rm -rf "$DOCKER_DIST_FOLDER/docker/base-images"
rm -rf "$DOCKER_DIST_FOLDER"/docker/proxy/certs/* # remove keys if present
rm -f "$DOCKER_DIST_FOLDER/docker/proxy/.env" # remove personal proxy .env if present
rm -f "$DOCKER_DIST_FOLDER/docker/proxy/.gitignore"
rm -f "$DOCKER_DIST_FOLDER/docker/proxy/nginx.conf"
rm -f "$DOCKER_DIST_FOLDER/docker/.env" # remove personal .env if present

mkdir "$DOCKER_DIST_FOLDER/$CORE_FOLDER/airflow"
mkdir "$DOCKER_DIST_FOLDER/$CORE_FOLDER/kong-gateway"
cp -r "$AIRFLOW_BASE_FOLDER/dags" "$DOCKER_DIST_FOLDER/$CORE_FOLDER/airflow/"
cp -r "$AIRFLOW_BASE_FOLDER/plugins" "$DOCKER_DIST_FOLDER/$CORE_FOLDER/airflow/"
cp -r "$KONG_CONFIG_FOLDER/plugins" "$DOCKER_DIST_FOLDER/$CORE_FOLDER/kong-gateway/"
cp -r "$KONG_CONFIG_FOLDER/kong.conf" "$DOCKER_DIST_FOLDER/$CORE_FOLDER/kong-gateway/"
cp -r "$KONG_CONFIG_FOLDER/kong.production.yml" "$DOCKER_DIST_FOLDER/$CORE_FOLDER/kong-gateway/kong.yml"
cp -r "$ELASTICSEARCH_CONFIG_FOLDER" "$DOCKER_DIST_FOLDER/$CORE_FOLDER"
cp -r "$SCHEMAS_FOLDER" "$DOCKER_DIST_FOLDER/$CORE_FOLDER"

echo "
# DIVA Docker distribution

[Repository](https://github.com/FraunhoferISST/diva) | [Documentation](https://fraunhoferisst.github.io/diva-docs/)

Quick start:
\`\`\`
cd docker
./up_core.sh
\`\`\`" >> "$DOCKER_DIST_FOLDER/README.md"

zip -r dist/docker-deployment.zip dist/docker-deployment

echo "🚀 Finished"
