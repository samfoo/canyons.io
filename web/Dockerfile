FROM debian:latest
RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install -y nodejs build-essential procps
COPY . /canyons-web
RUN npm config set production
RUN cd /canyons-web; npm install && npm run-script client && npm run-script styles
CMD ["node", "--use_strict", "/canyons-web/server.js"]
