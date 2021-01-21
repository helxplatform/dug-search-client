# Build environment
###################
FROM node:13.12.0-alpine

RUN apk update && apk upgrade && apk add nginx

# Create and set working directory
RUN mkdir /src
WORKDIR /src

# Add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

# Environment variable
ARG REACT_APP_API_ROOT=$REACT_APP_API_ROOT
ARG REACT_APP_DATA_API_ROOT=$REACT_APP_DATA_API_ROOT

# Install and cache app dependencies
COPY package*.json /src/
RUN npm install

# Copy in source files
COPY . /src

RUN chown -R nginx:nginx /src && \
    mkdir -p /usr/share/nginx/html && \
    mkdir -p /run/nginx && \
    touch /run/nginx/nginx.pid && \
    chown -R nginx:nginx /etc/nginx && \
    chown -R nginx:nginx /run/nginx/nginx.pid && \
    chown -R nginx:nginx /usr/local/lib/node_modules && \
    chown -R nginx:nginx /usr/share/nginx && \
    chown -R nginx:nginx /var/log/nginx

USER nginx

EXPOSE 8080

CMD ["/src/entrypoint.sh"]
