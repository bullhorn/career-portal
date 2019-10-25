# Bullhorn Career Portal

[![Build Status](https://travis-ci.org/bullhorn/career-portal.svg)](https://travis-ci.org/bullhorn/career-portal)

**[Bullhorn Career Portal](http://www.bullhorn.com)** is the next-generation way to share jobs and source candidates from your Bullhorn ATS/CRM instance. Download, configure and host your own career portal, or fork the source code and make it your own.\
## Releases

* **[Latest Release](https://github.com/bullhorn/career-portal/releases/latest)**
* **[All Releases](https://github.com/bullhorn/career-portal/releases)**

## Contribute

There are many ways to **[contribute](https://github.com/bullhorn/career-portal/blob/master/CONTRIBUTING.md)** to Bullhorn Career Portal.
* **[Submit bugs](https://github.com/bullhorn/career-portal/issues)** and help us verify fixes as they are checked in.
* Review **[source code changes](https://github.com/bullhorn/career-portal/pulls)**.
* **[Contribute bug fixes](https://github.com/bullhorn/career-portal/blob/master/CONTRIBUTING.md)**.

## Documentation

*  **[Hosting](https://github.com/bullhorn/career-portal/wiki)**
*  **[Bullhorn REST API Reference](http://bullhorn.github.io/rest-api-docs/)**
*  **[Bullhorn Platform](http://bullhorn.github.io/platform)**
*  **[Bullhorn Website](http://www.bullhorn.com)**

## Building

In order to build Bullhorn Career Portal, ensure that you have **[Git](http://git-scm.com/downloads)**, **[Node.js](http://nodejs.org)**, and **[Angular CLI](https://angular.io/guide/setup-local#step-1-install-the-angular-cli)** installed.

Clone a copy of the repo:

```
git clone https://github.com/bullhorn/career-portal.git
```

Change to the Career Portal directory:

```
cd career-portal
```

Install build tools and dev dependencies:

```
npm install
```

Use one of the following to build and test:

```
npm run serve           # Launch a local version of the career portal (frontend only).
npm start               # Launch a local server with server side rendering portal.
npm run build:static    # Build an optimized version of Career Portal in `/dist`
npm run build          # Build a package for use with server side rendering
```



## Runtime vs. Buildtime Configurations

To maximize the flexibility of application configuration, all configuration-level integrations should derive their
dynamic variables from the app.json file. That file can then be loaded into the application.

## Helpful Utilities

* **[NPM-Check-Updates](https://github.com/tjunnone/npm-check-updates)** - checks for updates of node modules with CLI
