FROM models
MAINTAINER Sam Gibson <sam@ifdown.net>

ADD package.json /tmp/package.json
RUN npm config set production
RUN cd /tmp && npm install
RUN npm install -g supervisor less webpack

RUN mkdir /app && cp -a /tmp/node_modules /app
ADD . /app

RUN cd /app; webpack && lessc --verbose --no-js --strict-imports ./src/components/application.less ./public/site.css
CMD ["node", "--use_strict", "/app/server.js"]
