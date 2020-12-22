#!/usr/bin/env bash

# git checkout master
# git pull origin master

docker-compose up --build -d
if (docker-compose exec client yarn && docker-compose exec client yarn build) ; then 
    echo 'restarting the nuxt server after a successful build'
    docker-compose stop
    docker-compose up
else
    echo 'yarn build was not successful, not restarting the server'
fi