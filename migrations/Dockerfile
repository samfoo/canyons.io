FROM debian:latest
RUN apt-get update
RUN apt-get install -y golang git build-essential
RUN GOPATH=/usr go get -u -v github.com/rubenv/sql-migrate/...
COPY . /migrations
