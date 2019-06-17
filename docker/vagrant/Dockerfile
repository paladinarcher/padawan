FROM centos

MAINTAINER Paladin and Archer

ARG APP_PACKAGES=curl\ gzip\ python\ build-essential\ git
ARG APP_LOCALE=en_US
ARG APP_CHARSET=UTF-8
ARG APP_USER=app
ARG APP_USER_DIR=/home/${APP_USER}

ENV APP_PORT=${APP_PORT:-3000}
ENV APP_ROOT=${APP_ROOT:-/app}

EXPOSE $APP_PORT
VOLUME $APP_ROOT

RUN yum -y install which
RUN yum install -y  ${APP_PACKAGES}
#RUN yum install curl gzip python 

RUN yum -y install bsdtar \
	&& cp $(which tar) $(which tar)~ \
	&& ln -sf $(which bsdtar) $(which tar)

RUN curl https://install.meteor.com/ | sh

RUN mv $(which tar)~ $(which tar)

RUN useradd -mUd ${APP_USER_DIR} ${APP_USER}
RUN chown -Rh ${APP_USER} /usr/local
USER ${APP_USER}

WORKDIR ${APP_ROOT}

COPY entrypoint.sh /

ENTRYPOINT [ "/entrypoint.sh" ]