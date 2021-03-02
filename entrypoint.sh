#!/bin/sh

set -x

cd /src

npm run build

cp nginx.conf /etc/nginx/conf.d/default.conf
cp -r /src/build/* /usr/share/nginx/html/

nginx -g "daemon off;"

# cp -r /usr/src/cache/node_modules/. /usr/src/app/node_modules/

# exec npm start