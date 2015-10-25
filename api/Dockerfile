FROM models
RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install -y nodejs build-essential
COPY . /canyons-api
RUN npm config set production
RUN npm install -g supervisor
RUN cd /canyons-api; npm install
CMD ["node", "--use_strict", "/canyons-api/server.js"]
