FROM models
RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install -y nodejs build-essential procps
COPY . /canyons-web
RUN npm config set production
RUN npm install -g supervisor less webpack
RUN cd /canyons-web; npm install && webpack && lessc --verbose --no-js --strict-imports ./src/components/application.less ./public/site.css
CMD ["node", "--use_strict", "/canyons-web/server.js"]
