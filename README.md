# Bullhorn Career Portal

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/)
* Bower `npm install bower -g`
* Gulp `npm install gulp -g`

## Installation
* `git clone REPO`
* `cd career-portal`
* `npm install && bower install`

## Running / Development
* `gulp serve` - runs the client with live-reload

## Before Committing
* Make sure to write karma/protractor tests for any new code
* Run `gulp test` - fix any errors
* Run `gulp protractor` - fix any errors
* Push!

### All GULP Tasks Available
* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files (will also build the extension on changes too)
* `gulp serve:dist` to launch a server on your optimized application
* `gulp test` to launch your unit tests with Karma
* `gulp test:auto` to launch your unit tests with Karma in watch mode
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

### "Nice-To-Have" Utilities
* [NPM-Check-Updates](https://github.com/tjunnone/npm-check-updates) - Checks for updates of node modules with CLI
* [Bower-Check-Updates](https://github.com/se-panfilov/bower-check-updates) - Checks for updates of bower dependencies with CLI
