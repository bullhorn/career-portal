import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { JobResolver } from './job.resolver';
import { environment } from '../environments/environment';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const appRoutes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'jobs/:id', component: JobDetailsComponent, resolve: { message: JobResolver } },
  { path: 'jobs', component: MainPageComponent },
  { path: 'privacy', component: PrivacyPolicyComponent },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
   imports: [RouterModule.forRoot(appRoutes, {
        enableTracing: false,
        useHash: environment.useHash,
        initialNavigation: 'enabled',
      })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
