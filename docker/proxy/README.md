# DIVA Reverse Proxy for Docker

This simple Nginx reverse proxy configuration serves as an example of how DIVA could be exposed to the world. The proxy
configuration in `nginx.example.conf` is minimalistic and **not** suitable for production!

In general, the Web-Client application and the API Gateway should be accessible through the network behind the proxy.
In addition, the client needs a running Keycloak instance, which does not necessarily have to be delivered by the same reverse proxy server.
So the rule is that only 3 DIVA components must be accessible over the internet - Web Client, Kong Gateway and Keycloak.
Furthermore, for the Web-Client app the access to API Gateway and Keycloak should be configured through the environment variables on runtime.

In the following we will go through an example configuration, which must give a rough idea of how DIVA could be delivered 
with a secured reverse proxy server. You will find more detail the Docker deployment guide in the DIVA [documentation](https://fraunhoferisst.github.io/diva-docs/dev-docs/deployment/docker.html).

1. Place your SSL certificate and key in `./certs`
   > Use letsencrypt, openssl or other tool of your choice. Here is a command that can quickly generate the required keys for you:
   > ```
   > openssl req -x509 -sha256 -nodes -newkey rsa:4096 -keyout private.key -out certificate.crt
   > ```

2. Create `nginx.conf` in `proxy/` and copy the contents of `nginx.example.conf` to it
   > In this file you can add more advanced configuration, e.g. caching.
   > Please note that your have to update the client app ENV's according to the changes in the config you made!

3. Create `.env` in `proxy/` and copy the contents from `.env.default` to it
   > You can choose a port for the proxy server in `.env` as `PROXY_PORT` with default `443` value.

4. Set Web-Client ENV's and restart container
   > Update the `VUE_APP_API_GATEWAY_URL` and `VUE_APP_KEYCLOAK_URL` in `docker/.env` corresponding to your nginx configuration.
   > Make sure the client can access all API endpoints and communicate with Keycloak. According to provided default configuration
   > the variables should be set for example as `VUE_APP_API_GATEWAY_URL=https://localhost/api` and `VUE_APP_KEYCLOAK_URL=https://localhost/auth/`


5. Set Keycloak ENV's and restart container (optional)
   > This step is only applicable if you do not have your own managed Keycloak instance running. In that case your have to update 
   > in your `docker/.env`: `KEYCLOAK_FRONTEND_URL=https://localhost/auth`.

6. Create Kong production config and restart container
   > In `core/kong-gateway` you have to create production config (e.g. kong.prod.yml). Your can copy the contents from 
   > `core/kong-gateway/kong.production.yml` to it, but have at least to set everywhere the correct Keycloak token issuer:
   > ```
   > plugins:
   >    - name: jwt-keycloak
   >      config:
   >        allowed_iss: [ "https://my.domain/auth/realms/my-realm" ]
   > ```

7. Make sure DIVA Core is already running
   > You can spin up anything needed with `./up_core.sh` in `docker/`

8. Run nginx proxy server in `proxy/` with:

   ```sh
   docker-compose up
   ```

On your local machine with the default nginx config the Web-Client should be available on `https://localhost`.
