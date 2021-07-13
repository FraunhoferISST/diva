#!/bin/sh

echo "Setting ENV's..."
for file in ./js/app.*.js*;
do
  echo "Processing $file";
  echo "VUE_APP_API_GATEWAY_URL: ${VUE_APP_API_GATEWAY_URL}"
  sed -i 's|http://localhost:8000|'$VUE_APP_API_GATEWAY_URL'|g' $file

done

echo "Starting Nginx"
nginx -g 'daemon off;'