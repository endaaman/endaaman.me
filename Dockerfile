FROM node:14-buster

# system
RUN apt-get update
RUN apt-get install -y supervisor nginx-extras

# app
ENV NODE_ENV production
WORKDIR /usr/src/app

RUN \
  chown -R www-data:www-data /var/lib/nginx && \
  echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
  rm /etc/nginx/sites-enabled/default

COPY package*.json /tmp/
RUN cd /tmp && npm --production=false install
RUN cp -a /tmp/node_modules ./

COPY nginx/front.conf /etc/nginx/sites-enabled/
COPY supervisor.conf /etc/supervisor/conf.d/

COPY . ./

RUN npm run build

EXPOSE 80 443
CMD ["/usr/bin/supervisord"]
