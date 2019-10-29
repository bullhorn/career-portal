
The Bullhorn Career Portal is capable of being parsed by search engines if using the "advanced hosting" option to serve your career portal. This article will go over how to tell google where to look for your jobs.

## Submitting your sitemap to Google

To start, you have 2 separate options:

 - [Add the career portal's sitemap to your website's robots.txt file](https://support.google.com/webmasters/answer/6062596?hl=en)
 - [Add your career portal's sitemap to Google Search Console](https://support.google.com/webmasters/answer/183668?hl=en).

### Accessing your sitemap or RSS feed
To find your career portal's sitemap, go to `[your career portal root]/sitemap`.  This page generates a list of your jobs in a format that search engines can use.  You also have access to a full RSS feed that some search engines use for listing your jobs. Your RSS feed can be found at `[your career portal root]/feed`. 

## How does it work.

When the Career Portal renders the job, it adds JSON in `application/ld+json` format.  This JSON tells search engine specifics about what is on the page.  It specifies to Google that the page is a job listing, and provides the data in a format search engines can understand.   To find the data that is being set, look at `src/app/structure-seo/structured-seo.component.ts`.  This file maps the Bullhorn fields to Google fields used for Google Jobs results. 

When the job is removed, whenever the search indexer attempts to reindex the page, it will return the status code of `404` letting the indexer know the job is no longer there.

