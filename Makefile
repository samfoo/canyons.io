logs:
	docker-compose logs

build:
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
	eslint models/*.js

watch-client:
	(cd web && npm link ../models)
	(cd web && webpack --watch --optimize-dedupe -d)

watch-styles:
	fswatch -i "\\.less" -e ".*" -o ./web/src | xargs -n1 -I{} make styles

.watch-fake: watch-client watch-styles

watch-all:
	make -j2 .watch-fake
