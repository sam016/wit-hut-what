# base image
FROM node:13.5.0-alpine3.10

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
RUN npm install -g create-react-app

COPY ./docker-entrypoint.sh /entrypoint.sh

# start app
ENTRYPOINT [ "/entrypoint.sh" ]
