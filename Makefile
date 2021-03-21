production-deploy:
	git checkout master -f
	git pull origin master
	make deploy

staging-deploy:
	git checkout develop -f
	git pull origin develop
	make deploy

deploy:
	docker-compose up --build -d
	if (docker-compose exec -T client yarn && docker-compose exec -T client yarn build) ; then  \
		echo 'restarting the nuxt server after a successful build'; \
		docker-compose stop; \
		docker-compose up -d; \
	else \
		echo 'yarn build was not successful, not restarting the server'; \
	fi