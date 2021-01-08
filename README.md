# DUG Search Client

This is a stand-alone client to use [DUG](https://github.com/helxplatform/dug)This is a [React](https://reactjs.org/) app containerized for development and production with [Docker Compose](https://docs.docker.com/compose/).

## Environment Variables

Define the API URL for DUG as the environment variable `REACT_APP_DUG_URL` in `.env`. Use `.env.example` as a guide. The development server will be accessible on port 3030, unless the variable `CLIENT_PORT` is specified differently in `.env`.

Production deployment defaults to port 80.

## Development

The development build details are defined in `./docker-compose.yaml` and `./Dockerfile`. This compose file is used by default when executing the following command.

```bash
$ docker-compose up
```

Add the `--build` directive if a build is ecessary. Visit `http://localhost:<CLIENT_PORT>` in a web browser to view the application. Note that one can take advantage with hot module reloading within this containerized development environment.

## Production

The production build details are defined in `./docker-compose.prod.yaml` and `./Dockerfile-prod`. Be sure to specify this compose file when building for production with the following command.

```bash
$ docker-compose -f docker-compose.prod.yaml up
```

Again, add the ` --build` flag to force a rebuild of the image. This deployment makes use of a multi-stage build&mdash;Node to build, Nginx to deploy&mdash;thus we make use of the Nginx configuration file `./nginx.conf`. This deploys to the host machine's port 80.

In order to build and deploy a single application on various environments, we require the web application to have access to environment variables defined on the host container. A small shell script `runtime-env-vars.sh` can be run to populate a JavaScript object with the host container's environment variables.

After spinning up the NGINX container to serve the dug seach client, we would run

```bash
$ docker exec -it dug-search-client bash ./usr/src/app/runtime-env-vars.sh DUG_URL
```

to give the client app access to the environment variable `DUG_URL` defined in the NGINX container.

A complete deployment may be accomplished with the following commands.

```bash
$ docker-compose -f docker-compose.prod.yaml up --build -d
$ docker exec -it dug-search-client bash ./usr/src/app/runtime-env-vars.sh DUG_URL
```
