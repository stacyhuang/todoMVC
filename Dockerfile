# Use Ruby as base image.
FROM ruby:2.2

# Throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

# Configure the main working directory. This is the base directory
# used in any further RUN, CMD, ENTRYPOINT, COPY, and ADD instructions
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the Gemfile as well ad the Gemfile.lock and bundle install
ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/
RUN bundle install --path vendor/bundle

# Install nodejs as JavaScript interpreter for Uglifier
RUN apt-get update && apt-get install -y nodejs

# Install nginx
ENV NGINX_VERSION 1.9.10-1~jessie
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
  && echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y ca-certificates nginx=${NGINX_VERSION} gettext-base \
  && rm -rf /var/lib/apt/lists/*

# Write our own nginx.conf
ADD nginx/nginx.conf /etc/nginx/nginx.conf
# Add environment variables to nginx
ADD nginx/main.d/env.conf /etc/nginx/main.d/env.conf
# Add sites-enabled directory
RUN mkdir -p /etc/nginx/sites-enabled
# Set default site
ADD nginx/sites-enabled/server.conf /etc/nginx/sites-enabled/server.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

# Copy the main application
ADD . /usr/src/app

RUN RAILS_ENV=production bin/rake assets:precompile

CMD nginx
