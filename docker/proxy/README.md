# DIVA Reverse Proxy for Docker

This simple `nginx reverse proxy` configuration serves as an example of how DIVA could be exposed to the world. The proxy
configuration in `nginx.example.conf` is minimalistic and **maybe not** suitable for production! In general, the Web-Client and the API Gateway should be accessible through the network. Furthermore, the Web-Client app requires a `VUE_APP_API_GATEWAY_URL` environment variable pointing to the API Gateway, so the client can reach the DIVA backend. 
Follow the steps to deploy DIVA behind reverse proxy in your experimenting environment:

1. Place your SSL certificate and key in `./certs`
   > Use letsencrypt, openssl or other tool of your choice

2. Create `nginx.conf` in `proxy/` and copy the contents of `nginx.example.conf` to it
   > In this file you can add more advanced configuration, e.g. caching.
   > Please note that your have to set the `VUE_APP_API_GATEWAY_URL`
   environment variable in `docker/.env`, if you change the URL of API Gateway. For example, if your reverse proxy
   > server is accessible on `https://my.domain.com` then you have to set `VUE_APP_API_GATEWAY_URL=https://my.domain.com/some/path`+

3. Create `.env` in `proxy/` and copy the contents from `.env.default` to it
   > You can choose a port for the proxy server in `.env` as `PROXY_PORT` with default `443` value. Make sure to update
   > `VUE_APP_API_GATEWAY_URL` in `docker/.env`, if you change the port

4. Make sure DIVA Core is already running
   > You can spin up anything needed with `./up_core.sh` in `docker/`

5. Run nginx proxy server in `proxy/` with:

   ```sh
   docker-compose up
   ```

On your local machine with the default nginx config the Web-Client is available on `https://localhost` and communicates with the backend on `https://localhost/api`.
