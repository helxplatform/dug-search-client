#!/bin/sh

set -x

cd /src

npm run build

cp nginx.conf /etc/nginx/conf.d/default.conf
cp -r /src/build/* /usr/share/nginx/html/

nginx -g "daemon off;"
