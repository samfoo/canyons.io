api/node_modules: api/package.json
	(cd api && npm install)
	touch api/node_modules

web/node_modules: web/package.json
	(cd web && npm install)
	touch web/node_modules

models/node_modules: models/package.json
	(cd models && npm install)
	touch models/node_modules

test-web: web/node_modules
	(cd web && NODE_ENV=test ./node_modules/.bin/jest --no-cache --verbose)

test-api: api/node_modules
	(cd api && \
		NODE_ENV=test \
		CLOUDINARY_API_KEY=apikey \
		CLOUDINARY_SECRET_KEY=apisecret \
		SESSION_SECRET=secret \
		WEB_DOMAIN=canyons.test \
		./node_modules/.bin/mocha --compilers js:babel-core/register --recursive)

test-models: models/node_modules
	(cd models && NODE_ENV=test mocha --compilers js:babel-core/register --recursive)

test: test-api test-models test-web

logs:
	docker-compose logs

clean: down
	docker images | sed "1 d" | awk '{ print $3; }' | xargs docker rmi -f

build:
	echo "clean node_modules for built docker"
	rm -rf web/node_modules
	rm -rf api/node_modules
	rm -rf models/node_modules
	(cd models; docker build -t models .)
	docker-compose build

up: models/node_modules
	docker-compose up -d
	make migrate

down:
	docker-compose stop
	docker-compose rm -f -v

restart: down up

migrate:
	docker-compose run migrations sql-migrate status -config /migrations/dbconfig.yml -env production
	docker-compose run migrations sql-migrate up -config /migrations/dbconfig.yml -env production

sh:
	docker-compose run $(host) bash

sql:
	docker-compose run db sh -c 'exec psql -h db -U canyons'

styles:
	(cd web && lessc --verbose --no-js --strict-imports ./src/components/application.less ./public/site.css)

client:
	(cd web && webpack)

lint:
	find web/src -name "*.js" | xargs eslint
	find web/__tests__ -name "*.js" | xargs eslint
	find api/src -name "*.js" | xargs eslint
	find api/__tests__ -name "*.js" | xargs eslint
	find models -name "*.js" | grep -v node_modules | xargs eslint

watch-client: web/node_modules
	(cd web && npm link ../models)
	(cd web && webpack --watch --optimize-dedupe -d)

watch-styles:
	fswatch -i "\\.less" -e ".*" -o ./web/src | xargs -n1 -I{} make styles

.watch-fake: watch-client watch-styles

watch-all:
	make -j2 .watch-fake
