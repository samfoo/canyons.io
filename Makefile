up:
	docker-compose up -d

down:
	docker-compose stop
	docker-compose rm -f -v

migrate:
	docker-compose run migrations sql-migrate status -config /migrations/dbconfig.yml -env production
	docker-compose run migrations sql-migrate up -config /migrations/dbconfig.yml -env production

sql:
	docker-compose run db sh -c 'exec psql -h db -U canyons'

styles:
	(cd web && lessc --verbose --no-js --strict-imports ./src/components/application.less ./public/site.css)

client:
	(cd web && webpack)

lint:
	eslint web/src/**/*.js
	eslint api/src/**/*.js

watch-client:
	(cd web && webpack --watch)

watch-styles:
	fswatch -i "\\.less" -e ".*" -o ./web/src | xargs -n1 -I{} make styles

.watch-fake: watch-client watch-styles

watch-all:
	make -j2 .watch-fake
