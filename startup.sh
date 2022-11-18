#!/bin/bash

echo "Copying custom default over to /etc/nginx/sites-available/default"

NGINX_CONF=/home/default

if [ -f "$NGINX_CONF" ]; then
    cp /home/site/default /etc/nginx/sites-available/default
    service nginx reload
else
    echo "File does not exist, skipping cp."
fi