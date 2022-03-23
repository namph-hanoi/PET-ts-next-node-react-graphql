# pull the base image
FROM node:lts-alpine

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY yarn.lock ./

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

# rebuild node-sass
RUN yarn add node-sass

RUN yarn

# add app
COPY . ./

EXPOSE 3000

# start app
CMD ["yarn", "dev"]