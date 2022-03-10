## High level overview
This repo is a basic [Angular/Angular Universal](https://angular.io/guide/universal) app.  There are automated tests in the `crypress/` directory to verify functionality is preserved.  The `src` directory has a majority of the UI logic.

### Quirks
This repo uses a fork of [novo-elements](https://github.com/bullhorn/novo-elements) that excludes the CKEditor. This should be changed at some point in the future, this will also benefit the bundle size of novo-elements.

## Releasing
To generate a release, create a tag and release in the Github UI, once created, attach the artifact from the [latest build](https://github.com/bullhorn/career-portal/actions/workflows/main.yaml).  Make sure the artifact is renamed to include the new release name.

### Testing before a Release
Test the release by uploading the artifact to some static host.  [Easiest is probably AWS S3](https://bullhorn.github.io/career-portal/Uploading-to-Amazon-AWS-S3.html).

