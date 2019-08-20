import 'zone.js/dist/zone-node';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import { join } from 'path';
import { createWindow } from 'domino';
import { readFileSync, writeFile } from 'fs';
import * as path from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app: any = express();

const PORT: string | number = process.env.PORT || 4000;
const DIST_FOLDER: string = join(process.cwd(), 'dist/browser');
const template: any = readFileSync(path.join(join(DIST_FOLDER, 'index.html'))).toString();
const win: Window = createWindow(template);
global['window'] = win;
global['document'] = win.document;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)

if (process.env.COMPANY_NAME) {
  let appConfig: ISettings = JSON.parse(readFileSync(path.join(join(DIST_FOLDER, 'app.json'))).toString());
  appConfig.service.swimlane = process.env.BULLHORN_SWIMLANE;
  appConfig.service.corpToken = process.env.BULLHORN_CORP_TOKEN;
  appConfig.careersUrl = process.env.HOSTED_ENDPOINT;
  appConfig.companyName = process.env.COMPANY_NAME;
  appConfig.companyUrl = process.env.COMPANY_WEBSITE;
  appConfig.companyLogoPath = process.env.COMPANY_LOGO_URL;
  appConfig.integrations.googleAnalytics.trackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID;

  writeFile(path.resolve(DIST_FOLDER, 'app.json'), JSON.stringify(appConfig), (err: any) => {
    if (err) {
      // tslint:disable-next-line: no-console
      console.error('Failed to write config file:', err.message);
    }
  });
}

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
  maxAge: '1y',
}));

// All regular routes use the Universal engine
app.get('*', (req: any, res: any) => {
  res.render('index', { req });
});

// Start up the Node server
app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
