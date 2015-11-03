api/node_modules: api/package.json
	(cd api && npm install)

web/node_modules: web/package.json
	(cd web && npm install)

models/node_modules: models/package.json
	(cd models && npm install)

test-api: api/node_modules
	(cd api && NODE_ENV=test SESSION_SECRET=secret WEB_DOMAIN=canyons.test mocha --compilers js:babel-core/register)

test-models: models/node_modules
	(cd models && NODE_ENV=test mocha --compilers js:babel-core/register)

test: test-api test-models

logs:
	docker-compose logs

build:
	echo "clean node_modules for built docker"
	rm -rf web/node_modules
	rm -rf api/node_modules
	rm -rf models/node_modules
	(cd models; docker build -t models .)
	docker-compose build

up:
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
	eslint web/src/*.js
	eslint web/src/**/*.js
	eslint api/src/*.js
	eslint api/src/**/*.js
	eslint api/test/*.js
	eslint api/test/**/*.js
	eslint models/*.js
	eslint models/test/*.js

watch-client:
	(cd web && npm link ../models)
	(cd web && webpack --watch --optimize-dedupe -d)

watch-styles:
	fswatch -i "\\.less" -e ".*" -o ./web/src | xargs -n1 -I{} make styles

.watch-fake: watch-client watch-styles

watch-all:
	make -j2 .watch-fake
