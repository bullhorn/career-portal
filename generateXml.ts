import { get } from 'https';
import { IncomingMessage } from 'http';
import { JobBoardPost } from '@bullhorn/bullhorn-types';
import * as jsonxml from 'jsontoxml';
import { ISettings } from './src/app/typings/settings';

export function generateSitemap(appConfig: ISettings, res: any, req: any): any {
  let sitemapUrls: { name: 'url', children: [{ name: 'loc', text: string }, { name: 'lastmod', text: string }] }[] = [];
  let jobsUrl: string = `https://public-rest${appConfig.service.swimlane}.bullhornstaffing.com/rest-services/${appConfig.service.corpToken}/search/JobOrder?query=(isOpen:1%20AND%20isDeleted:0)${getQuery(appConfig)}&fields=id,title,address(city,state,zip),employmentType,dateLastPublished,publicDescription&count=500&sort=-dateLastPublished&start=0`;
  let body: string = '';
  get(jobsUrl, (response: IncomingMessage) => {

    response.on('data', function (chunk: any): any {
      body += chunk;
    });

    response.on('end', function (): any {
      let jobs: JobBoardPost[] = JSON.parse(body).data;
      jobs.forEach((job: JobBoardPost) => {
        let postDate: Date = new Date(job.dateLastPublished);
        sitemapUrls.push({
          name: 'url',
          children: [
            { name: 'loc', text: `${req.protocol}://${req.hostname}${req.originalUrl.replace('/sitemap', '/jobs')}/${job.id}` },
            { name: 'lastmod', text: `${postDate.getFullYear()}-${('0' + (postDate.getMonth() + 1)).slice(-2)}-${('0' + postDate.getDate()).slice(-2)}` },
          ],
        });
      });

      res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> ${jsonxml(sitemapUrls)}</urlset>`);
    });
  });

}

export function generateRss(appConfig: ISettings, res: any, req: any): any {
  let jobListings: any = {
    children: [], title: `${appConfig.companyName} Job Opportunities`, link: `${req.protocol}://${req.hostname}${req.originalUrl}`, pubDate: new Date().toUTCString(), ttl: 5};
  let jobsUrl: string = `https://public-rest${appConfig.service.swimlane}.bullhornstaffing.com/rest-services/${appConfig.service.corpToken}/search/JobOrder?query=(isOpen:1%20AND%20isDeleted:0)${getQuery(appConfig)}&fields=id,title,address(city,state,zip),employmentType,dateLastPublished,publicDescription&count=500&sort=-dateLastPublished&start=0`;
  let body: string = '';
  get(jobsUrl, (response: IncomingMessage) => {

    response.on('data', function (chunk: any): any {
      body += chunk;
    });

    response.on('end', function (): any {
      let jobs: JobBoardPost[] = JSON.parse(body).data;
      jobs.forEach((job: JobBoardPost) => {
        let postDate: Date = new Date(job.dateLastPublished);
        jobListings.children.push({
          name: 'item',
          children: [
            { name: 'title', text: escapeHtml(job.title) },
            { name: 'description', text: escapeHtml(job.publicDescription) },
            { name: 'city', text: job.address.city },
            { name: 'state', text: job.address.state },
            { name: 'zip', text: job.address.zip },
            { name: 'pubDate', text: postDate.toUTCString() },
            { name: 'link', text: `${req.protocol}://${req.hostname}${req.originalUrl.replace('/feed', '/jobs')}/${job.id}`},
          ],
        });
      });

      res.send(`<rss version="2.0">
          <channel>
        ${jsonxml(jobListings)}</channel>
</rss>`);
    });
  });

}

function getQuery(appConfig: ISettings): string {
  const isSearch: boolean = true;
  let field: string = appConfig.additionalJobCriteria.field;
  let values: string[] = appConfig.additionalJobCriteria.values;
  let query: string = '';
  let delimiter: '"' | '\'' = isSearch ? '"' : '\'';
  let equals: ':' | '=' = isSearch ? ':' : '=';

  if (field && values.length > 0 && field !== '[ FILTER FIELD HERE ]' && values[0] !== '[ FILTER VALUE HERE ]') {
    for (let i: number = 0; i < values.length; i++) {
      if (i > 0) {
        query += ` OR `;
      } else {
        query += ' AND (';
      }
      query += `${field}${equals}${delimiter}${values[i]}${delimiter}`;
    }
    query += ')';
  }
  return query;
}

function escapeHtml(text: any): string  {
  if (!text) {
    return '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
