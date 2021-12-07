#########################
### build environment ###
#########################

# base image
FROM node:14.16.1 as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package-lock.json /usr/src/app/package-lock.json
COPY package.json /usr/src/app/package.json
RUN npm install -g @angular/cli@10.2.3 --unsafe
RUN npm ci

# add app
COPY . /usr/src/app

# generate build
RUN npm run build:qa

##################
### production ###
##################

# base image
FROM httpd:2.4

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/career-portal/browser /usr/local/apache2/htdocs/

# expose port 80
EXPOSE 80

