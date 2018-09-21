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
npm install -g bower
npm install -g gulp
npm install
bower install
```

Use one of the following to build and test:

```
gulp                 # Build an optimized version of Career Portal in `/dist`
gulp build           # Build an optimized version of Career Portal in `/dist`
gulp serve           # Launch a BrowserSync server on source files, building extensions on changes
gulp serve:dist      # Launch a server on optimized version of Career Portal
gulp test            # Execute unit tests with Karma
gulp test:auto       # Execute unit tests with Karma in watch mode
gulp protractor      # Execute e2e tests with Protractor
gulp protractor:dist # Execute e2e tests with Protractor on build output
```

Running and building with configuration

```
gulp --corpToken='[CORP_TOKEN]' --sl='[SWIMLANE]' --companyName='[COMPANY_NAME]' --liClientId='[LINKED_IN_CLIENT_ID]'
gulp serve --corpToken='[CORP_TOKEN]' --sl='[SWIMLANE]' --companyName='[COMPANY_NAME]' --liClientId='[LINKED_IN_CLIENT_ID]'
```

## Apply with LinkedIn

**Bullhorn Career Portal** supports integrated LinkedIn profiles during the candidate application process via the
[Apply with LinkedIn](https://developer.linkedin.com/docs/apply-with-linkedin) SDK. To enable this feature, **Bullhorn Career
Portal** customers must [register as a LinkedIn integration partner](https://developer.linkedin.com/partner-programs/apply),
[create and configure a new LinkedIn partner application](https://www.linkedin.com/developer/apps/new) and provide a value for the
`CLIENT_ID` token in `app.json`. **Note** that the registered partner app should  have `r_fullprofile`, `r_contactinfo` and
`r_emailaddress` default application permissions for best results.

Additionally, **Bullhorn Career Portal** customers need to whitelist development and production environment IP addresses and/or
hostnames in order to successfully connect to the LinkedIn API. A common development environment, and the default environment configured by
the **Bullhorn Career Portal** build system is `localhost`, at the loopback address of `127.0.0.1`. The build system starts
an HTTP Server at `http://localhost:3000` when building/running locally. Since LinkedIn doesn't allow for `localhost` to be whitelisted,
whitelist `http://127.0.0.1` instead, and point the browser to the raw IP address.

#### iOS & Safari

Unfortunately, LinkedIn's JS SDK is incompatible with iOS 5+ due to the way that Javascript is paused during cross-window
communication processes. Therefore, the Apply with LinkedIn feature is not supported in that runtime environment. Users will
experience an apply workflow that simply excludes the Apply with LinkedIn capability.


## Runtime vs. Buildtime Configurations

To maximize the flexibility of application configuration, all configuration-level integrations should derive their
dynamic variables from the app.json file. That file can then be loaded into the application. The LinkedIn integration
requires a custom ClientID in order to access the LinkedIn API. This property is defined in the app.json and injected
into the app in the linkedInRun (an ng-run function).

## Helpful Utilities

* **[NPM-Check-Updates](https://github.com/tjunnone/npm-check-updates)** - checks for updates of node modules with CLI
* **[Bower-Check-Updates](https://github.com/se-panfilov/bower-check-updates)** - checks for updates of bower dependencies with CLI
