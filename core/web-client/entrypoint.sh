#!/bin/sh

index_html="./index.html"

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

  echo "Hashing $file"
  hash=$(md5sum "$file" | cut -c1-8)
  echo "$hash"
  new_name="./js/app.$hash.js"

  if [ "$file" = "$new_name" ]; then
    echo "Nothing changed"
  else
    echo "Rename $file to $new_name"
    mv "$file" "$new_name"
    updated_file=${file/./}
    updated_new_name=${new_name/./}
    echo "Update $index_html"
    sed -i 's|'$updated_file'|'$updated_new_name'|g' $index_html
  fi
done

echo "Starting Nginx"
nginx -g 'daemon off;'