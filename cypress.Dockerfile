# base image
FROM cypress/browsers:latest

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# install cypress
RUN npm install cypress@latest
RUN npm install cypress-file-upload@5.0.8
RUN npm install typescript@3.9.7

# copy cypress files and folders
COPY cypress /usr/src/app/cypress
COPY cypress /usr/src/app/cypress
COPY cypress.json /usr/src/app/cypress.json

# confirm the cypress install
RUN ./node_modules/.bin/cypress verify
