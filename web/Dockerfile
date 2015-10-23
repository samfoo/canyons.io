FROM models
RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install -y nodejs build-essential procps
COPY . /canyons-web
RUN npm config set production
RUN cd /canyons-web; npm install && ./node_modules/.bin/webpack && ./node_modules/.bin/lessc --verbose --no-js --strict-imports ./src/components/application.less ./public/site.css
CMD ["node", "--use_strict", "/canyons-web/server.js"]
