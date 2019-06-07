# Bullhorn Career Portal

[![Build Status](https://travis-ci.org/bullhorn/career-portal.svg)](https://travis-ci.org/bullhorn/career-portal)
[![Dependency Status](https://gemnasium.com/bullhorn/career-portal.svg)](https://gemnasium.com/bullhorn/career-portal)
[![Code Climate](https://codeclimate.com/github/bullhorn/career-portal/badges/gpa.svg)](https://codeclimate.com/github/bullhorn/career-portal)
[![Test Coverage](https://codeclimate.com/github/bullhorn/career-portal/badges/coverage.svg)](https://codeclimate.com/github/bullhorn/career-portal/coverage)

**[Bullhorn Career Portal](http://www.bullhorn.com)** is the next-generation way to share jobs and source candidates from your Bullhorn ATS/CRM instance. Download, configure and host your own career portal, or fork the source code and make it your own.

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
*  **[Bullhorn REST API Reference](http://developer.bullhorn.com/articles/getting_started)**
*  **[Bullhorn Platform](http://bullhorn.github.io/platform)**
*  **[Bullhorn Website](http://www.bullhorn.com)**

## Building

In order to build Bullhorn Career Portal, ensure that you have **[Git](http://git-scm.com/downloads)** and **[Node.js](http://nodejs.org)** installed.

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
npm install -g @angular/cli
npm install
```

Use one of the following to build and test:

```
npm start            # Launch a local version of the career portal locally.
npm run build        # Build an optimized version of Career Portal in `/dist`
npm run build:ssr    # Build a package for use with server side rendering
npm run serve:ssr    # Launch a local server with server side rendering
```



## Runtime vs. Buildtime Configurations

To maximize the flexibility of application configuration, all configuration-level integrations should derive their
dynamic variables from the app.json file. That file can then be loaded into the application.

## Helpful Utilities

* **[NPM-Check-Updates](https://github.com/tjunnone/npm-check-updates)** - checks for updates of node modules with CLI
