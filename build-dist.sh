#!/bin/sh
DIST_FOLDER="dist"
KONG_CONFIG_FOLDER="core/kong-gateway"
ELASTICSEARCH_CONFIG_FOLDER="core/elasticsearch"
AIRFLOW_BASE_FOLDER="core/airflow"
SCHEMAS_FOLDER="core/schemata"

echo "🏭 Building Distribution..."
rm -r "$DIST_FOLDER" # remove old dist if it exists
mkdir -p -- "$DIST_FOLDER" # create dist folder
mkdir -p -- "$DIST_FOLDER/docker-deployment" # create dist folder

echo "🐋 Building Docker Distribution..."

DOCKER_FOLDER="docker"
DOCKER_DIST_FOLDER="dist/docker-deployment"

cp -r "$DOCKER_FOLDER"* "$DOCKER_DIST_FOLDER/docker" # copy docker-compose files
rm -f "$DOCKER_DIST_FOLDER/docker/docker-compose.override.yml" # remover override as it's only for local dev
rm -f "$DOCKER_DIST_FOLDER/docker/.env" # remove personal .env if present

mkdir "$DOCKER_DIST_FOLDER/airflow"
cp -r "$AIRFLOW_BASE_FOLDER/dags" "$DOCKER_DIST_FOLDER/airflow"
cp -r "$AIRFLOW_BASE_FOLDER/plugins" "$DOCKER_DIST_FOLDER/airflow"
cp -r "$KONG_CONFIG_FOLDER" "$DOCKER_DIST_FOLDER"
cp -r "$ELASTICSEARCH_CONFIG_FOLDER" "$DOCKER_DIST_FOLDER"
cp -r "$SCHEMAS_FOLDER" "$DOCKER_DIST_FOLDER"

echo "# DIVA Docker distribution\nQuick start:\n\`\`\`\ncd docker\n./up_core.sh\n\`\`\`" >> "$DOCKER_DIST_FOLDER/README.md"

echo "🚀 Finished"
