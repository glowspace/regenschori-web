production-pull:
	git checkout master -f
	git pull origin master

staging-pull:
	git checkout develop -f
	git pull origin develop

deploy:
	docker-compose up --build -d
	if (docker-compose exec -T client yarn && docker-compose exec -T client yarn build) ; then  \
		echo 'restarting the pm2 server after a successful build'; \
		docker-compose exec -T client pm2 reload all --update-env; \
	else \
		echo 'yarn build was not successful, not restarting the server'; \
	fi
	sudo /var/www/html/nginx_clear_cache.sh