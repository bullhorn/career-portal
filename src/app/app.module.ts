import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { NovoListModule, NovoElementsModule, NovoHeaderModule, NovoModalModule, NovoModalService, FieldInteractionApi, NovoToastService,  } from 'novo-elements';
import { MainPageComponent } from './main-page/main-page.component';
import { JobDetailsComponent } from './job-list/job-details/job-details.component';
import { ApplyModalComponent } from './job-list/job-details/apply-modal/apply-modal.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ErrorModalComponent } from './error-modal/error-modal/error-modal.component';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'job/:id', component: JobDetailsComponent },
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
],
  entryComponents: [
    ApplyModalComponent,
    ErrorModalComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NovoElementsModule,
    NovoListModule,
    NovoHeaderModule,
    NovoModalModule,
    ClipboardModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
    { enableTracing: false, useHash: false }, // <-- debugging purposes only
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
