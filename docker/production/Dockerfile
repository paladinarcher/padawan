FROM centos
MAINTAINER Paladin and Archer
#ENV NODEJS_VERSION=v8.7.0
ENV NODEJS_VERSION=v10.15.0
ENV PATH=/apps/node/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/bin
ENV USER=root
ENV HOME=/root/
ENV METEOR_SETTINGS="$(cat /var/www/padawan/bundle/settings.prod.json)"

WORKDIR /root/
COPY padawan-node-setup.sh /root/
RUN chmod +x padawan-node-setup.sh
RUN ./padawan-node-setup.sh
ENV TAG_WORKAROUND=201711240332
ADD ./padawan.tar.gz /var/www/padawan/
WORKDIR /var/www/padawan/bundle/programs/server/
RUN npm i && npm i forever -g && npm i forever
WORKDIR /var/www/padawan/bundle/
ENTRYPOINT ["forever","main.js"]
