import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule, initSettings } from './app.module';
import { AppComponent } from './app.component';
import { ServerTranslationLoader } from './services/localization/server-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SettingsService } from './services/settings/settings.service';
import { RouterModule, Routes } from '@angular/router';
import { JobResolver } from './job.resolver';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { MainPageComponent } from './main-page/main-page.component';
import { JobDetailsComponent } from './job-details/job-details.component';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'jobs/:id', component: JobDetailsComponent, resolve: { message: JobResolver } },
  { path: 'jobs', component: MainPageComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
];
@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: true,
        useHash: false,
        initialNavigation: 'enabled',
      },
    ),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: ServerTranslationLoader,
      },
    }),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initSettings, deps: [SettingsService], multi: true },
  ],
})
export class AppServerModule {}
