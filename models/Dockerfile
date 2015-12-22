FROM debian:latest
MAINTAINER Sam Gibson <sam@ifdown.net>

RUN apt-get update
RUN apt-get install -y curl
RUN curl --silent --location https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs build-essential

ADD package.json /tmp/package.json
RUN npm config set production
RUN cd /tmp && npm install
RUN mkdir /models && cp -a /tmp/node_modules /models

ADD . /models
CMD ["/bin/true"]
