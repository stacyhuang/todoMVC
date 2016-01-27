# Use Ruby as base image.
FROM ruby:2.2

# Throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

# Configure the main working directory. This is the base directory
# used in any further RUN, CMD, ENTRYPOINT, COPY, and ADD instructions
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy the Gemifle as well ad the Gemfile.lock and bundle install
ADD Gemfile /usr/src/app/
ADD Gemfile.lock /usr/src/app/
RUN bundle install --path vendor/bundle

# Install nodejs as JavaScript interpreter for Uglifier
RUN apt-get update && apt-get install -y nodejs

# Copy the main application
ADD . /usr/src/app

CMD ["bundle", "exec", "thin", "start"]
