FROM debian:latest

MAINTAINER Rick Golden "golden@golden-garage.net"

# build arguments
ARG APP_PACKAGES=curl\ gzip\ python\ build-essential\ git
ARG APP_LOCALE=en_US
ARG APP_CHARSET=UTF-8
ARG APP_USER=app
ARG APP_USER_DIR=/home/${APP_USER}

# run environment
ENV APP_PORT=${APP_PORT:-3000}
ENV APP_ROOT=${APP_ROOT:-/app}

# exposed ports and volumes
EXPOSE $APP_PORT
VOLUME $APP_ROOT

# add packages for building NPM modules (required by Meteor)
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
  apt-get -y dist-upgrade && \
  apt-get install -y  ${APP_PACKAGES} && \
  apt-get autoremove && \
  apt-get clean

# set the locale (required by Meteor)
#RUN localedef ${APP_LOCALE}.${APP_CHARSET} -i ${APP_LOCALE} -f ${APP_CHARSET}

# create a non-root user that can write to /usr/local (suggested by Meteor)
RUN useradd -mUd ${APP_USER_DIR} ${APP_USER}
RUN chown -Rh ${APP_USER} /usr/local

# meteor installer doesn't work with the default tar binary
RUN apt-get install -y bsdtar \
    && cp $(which tar) $(which tar)~ \
    && ln -sf $(which bsdtar) $(which tar)

# install Meteor
RUN curl https://install.meteor.com/ | sh

# put back the original tar
RUN mv $(which tar)~ $(which tar)

USER ${APP_USER}

# run Meteor from the app directory
WORKDIR ${APP_ROOT}
COPY entrypoint.sh /
#RUN /usr/local/bin/meteor update

ENTRYPOINT [ "/entrypoint.sh" ]
