import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChomskyModule } from 'chomsky';

import { AppComponent } from './app.component';
import { JobListComponent } from './job-list/job-list.component';
import { SettingsService } from './services/settings/settings.service';
import { AnalyticsService } from './services/analytics/analytics.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SearchService } from './services/search/search.service';
import { ShareService } from './services/share/share.service';
import { ApplyService } from './services/apply/apply.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarFilterComponent } from './sidebar/sidebar-filter/sidebar-filter.component';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { NovoListModule, NovoElementsModule, NovoHeaderModule, NovoModalModule, NovoModalService, FieldInteractionApi, NovoToastService,  } from 'novo-elements';
import { MainPageComponent } from './main-page/main-page.component';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';
import { ApplyModalComponent } from './job-list/job-details/apply-modal/apply-modal.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorModalComponent } from './error-modal/error-modal/error-modal.component';
import { StripHtmlPipe } from './utils/stripHtml.pipe';
import { StructuredSeoComponent } from './structured-seo/structured-seo.component';
import { DatePipe } from '@angular/common';
import { JobResolver } from './job.resolver';
import { ServerResponseService } from './services/server-response/server-response.service';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'jobs/:id', component: JobDetailsComponent, resolve: { message: JobResolver } },
];

export function initSettings(settings: SettingsService): any {
  return () => settings.load();
}

@NgModule({
   declarations: [
      AppComponent,
      JobListComponent,
      SidebarComponent,
      MainPageComponent,
      JobDetailsComponent,
      ApplyModalComponent,
      ErrorModalComponent,
      StripHtmlPipe,
      SidebarFilterComponent,
      StructuredSeoComponent,
   ],
   entryComponents: [
      ApplyModalComponent,
      ErrorModalComponent,
   ],
   imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    NovoElementsModule,
    NovoListModule,
    NovoHeaderModule,
    BrowserTransferStateModule,
    NovoModalModule,
    ClipboardModule,
    FormsModule,
    ChomskyModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, useHash: environment.useHash },
  ),
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initSettings, deps: [SettingsService], multi: true },
    SettingsService,
    SearchService,
    ShareService,
    FieldInteractionApi,
    NovoModalService,
    NovoToastService,
    ApplyService,
    AnalyticsService,
    DatePipe,
    JobResolver,
    ServerResponseService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
