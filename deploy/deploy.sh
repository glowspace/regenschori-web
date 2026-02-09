#!/bin/sh
BRANCH="${1:-main}"
git checkout ${BRANCH} -f
git pull origin ${BRANCH}
docker compose up --build -d
