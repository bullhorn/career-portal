import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join, resolve } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync, writeFile } from 'fs';
import { createWindow } from 'domino';
import { ISettings } from './src/app/typings/settings';
import { generateRss, generateSitemap } from './generateXml';

const DIST_FOLDER: string = join(process.cwd(), 'dist/career-portal/browser');
let appConfig: ISettings = JSON.parse(readFileSync(join(DIST_FOLDER, 'app.json')).toString());

if (process.env.COMPANY_NAME) {
  appConfig.service.swimlane = process.env.BULLHORN_SWIMLANE;
  appConfig.service.corpToken = process.env.BULLHORN_CORP_TOKEN;
  appConfig.careersUrl = process.env.HOSTED_ENDPOINT;
  appConfig.companyName = process.env.COMPANY_NAME;
  appConfig.companyUrl = process.env.COMPANY_WEBSITE;
  appConfig.companyLogoPath = process.env.COMPANY_LOGO_URL;
  appConfig.integrations.googleAnalytics.trackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID;
  appConfig.integrations.googleSiteVerification.verificationCode = process.env.GOOGLE_VERIFICATION_CODE;

  writeFile(resolve(DIST_FOLDER, 'app.json'), JSON.stringify(appConfig), (err: any) => {
    if (err) {
      // tslint:disable-next-line: no-console
      console.error('Failed to write config file:', err.message);
    }
  });
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server: any = express();
  const distFolder: any = join(process.cwd(), 'dist/career-portal/browser');
  const indexHtml: any = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const template: any = readFileSync(join(distFolder, 'index.html')).toString();
  const win: Window = createWindow(template);
  (<any> global['window']) = win;
  global['document'] = win.document;
  global['navigator'] = win.navigator;
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y',
  }));

  server.get('/sitemap', (req: any, res: any) => {
    res.type('application/xml');
    res.contentType('application/xml');
    generateSitemap(appConfig, res, req);
  });

  server.get('/feed', (req: any, res: any) => {
    res.type('application/xml');
    res.contentType('application/xml');
    generateRss(appConfig, res, req);
  });

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
