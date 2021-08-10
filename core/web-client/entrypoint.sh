#!/bin/sh

echo "Setting ENV's..."
for file in ./js/app.*.js*;
do
  echo "Processing $file";

  echo "VUE_APP_API_GATEWAY_URL: ${VUE_APP_API_GATEWAY_URL}"
  sed -i 's|http://localhost:8000|'$VUE_APP_API_GATEWAY_URL'|g' $file

  echo "VUE_APP_KEYCLOAK_URL: ${VUE_APP_KEYCLOAK_URL}"
  sed -i 's|http://172.17.0.1:7000/auth|'$VUE_APP_KEYCLOAK_URL'|g' $file

  echo "VUE_APP_KEYCLOAK_REALM: ${VUE_APP_KEYCLOAK_REALM}"
  sed -i 's|diva-kc-realm|'$VUE_APP_KEYCLOAK_REALM'|g' $file

  echo "VUE_APP_KEYCLOAK_CLIENT_ID: ${VUE_APP_KEYCLOAK_CLIENT_ID}"
  sed -i 's|diva-kc-client|'$VUE_APP_KEYCLOAK_CLIENT_ID'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'