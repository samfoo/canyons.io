staging:
	# echo "building fresh image to deploy"
	# make build
	echo "building digital ocean docker host"
	docker-machine create --driver digitalocean \
		--digitalocean-access-token $(DIGITAL_OCEAN_API_TOKEN) \
		--digitalocean-size 2gb \
		--digitalocean-region sgp1 \
		staging.canyons.io

staging.migrate:
	docker-compose -f docker-compose.staging.yml run migrations sql-migrate status -config /migrations/dbconfig.yml -env production
	docker-compose -f docker-compose.staging.yml run migrations sql-migrate up -config /migrations/dbconfig.yml -env production

staging.destroy: staging.down
	docker-compose -f docker-compose.staging.yml rm -f -v

staging.down:
	DOCKER_CLIENT_TIMEOUT=300 docker-compose -f docker-compose.staging.yml stop

staging.up:
	DOCKER_CLIENT_TIMEOUT=300 docker-compose -f docker-compose.staging.yml up -d

staging.build:
	(cd models; docker build -t models .)
	docker-compose -f docker-compose.staging.yml build

staging.sql:
	docker-compose -f docker-compose.staging.yml run db sh -c 'exec psql -h db -U canyons'

staging.logs:
	docker-compose -f docker-compose.staging.yml logs

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
	(cd web && NODE_ENV=test mocha --compilers js:babel-core/register --recursive --require test/setup.js)

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
	(cd models; docker build -t models .)
	docker-compose build

up: models/node_modules
	DOCKER_CLIENT_TIMEOUT=300 docker-compose up -d
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
	find models/src -name "*.js" | grep -v node_modules | xargs eslint

watch-client: web/node_modules
	(cd web && npm link ../models)
	(cd web && webpack --watch --optimize-dedupe -d)

watch-styles:
	fswatch -i "\\.less" -e ".*" -o ./web/src | xargs -n1 -I{} make styles

watch-web: web/node_modules
	(cd web && ./node_modules/babel-cli/bin/babel.js -w -d lib src)

watch-api: api/node_modules
	(cd api && ./node_modules/babel-cli/bin/babel.js -w -d lib src)

watch-models:
	(cd models && ./node_modules/babel-cli/bin/babel.js -w -d lib src)

.develop-fake: watch-client watch-styles watch-web watch-api watch-models

develop:
	make -j5 .develop-fake

precommit: lint test
