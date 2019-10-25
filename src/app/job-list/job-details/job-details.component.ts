import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { NovoModalService } from 'novo-elements';
import { SettingsService } from '../../services/settings/settings.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { ApplyModalComponent } from './apply-modal/apply-modal.component';
import { ShareService } from '../../services/share/share.service';
import { ErrorModalComponent } from '../../error-modal/error-modal/error-modal.component';
import { Title, Meta } from '@angular/platform-browser';
import { JobBoardPost } from '@bullhorn/bullhorn-types';
import { ServerResponseService } from '../../services/server-response/server-response.service';
import { TranslateService } from 'chomsky';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  public job: JobBoardPost | any;
  public id: string;
  public source: string;
  public loading: boolean = true;
  public relatedJobs: any;
  public showShareButtons: boolean = false;
  public alreadyApplied: boolean = false;
  public jobInfoChips: [string|JobChipField] = SettingsService.settings.service.jobInfoChips;
  public showCategory: boolean  = SettingsService.settings.service.showCategory;
  private APPLIED_JOBS_KEY: string = 'APPLIED_JOBS_KEY';

  constructor(
    private service: SearchService,
    private shareService: ShareService,
    private route: ActivatedRoute,
    private router: Router,
    private analytics: AnalyticsService,
    private modalService: NovoModalService,
    private viewContainerRef: ViewContainerRef,
    private titleService: Title,
    private meta: Meta,
    private serverResponse: ServerResponseService,
  ) {
    this.modalService.parentViewContainer = this.viewContainerRef;
  }

  public ngOnInit(): void {
    this.loading = true;
    this.id = this.route.snapshot.paramMap.get('id');
    this.source = this.route.snapshot.queryParams.source;
    this.analytics.trackEvent(`Open Job: ${this.id}`);
    this.checkSessionStorage();
    this.setJob();
  }

  public checkSessionStorage(): void {
    if (!SettingsService.isServer) {
      let alreadyAppliedJobs: any = sessionStorage.getItem(this.APPLIED_JOBS_KEY);
      if (alreadyAppliedJobs) {
        let alreadyAppliedJobsArray: any = JSON.parse(alreadyAppliedJobs);
        this.alreadyApplied = (alreadyAppliedJobsArray.indexOf(parseInt(this.id)) !== -1);  // tslint:disable-line
      }
    }
  }

  public getRelatedJobs(): any {
    if (this.job && this.job.publishedCategory) {
      this.service.getjobs({ 'publishedCategory.id': [this.job.publishedCategory.id]}, {} , SettingsService.settings.service.batchSize).subscribe((res: any) => { this.relatedJobs = res.data; });
    }
  }

  public apply(): void {
    this.analytics.trackEvent(`Open Apply Form ${this.job.id}`);
    this.modalService.open(ApplyModalComponent, {
      job: this.job,
      source: this.source,
      viewContainer: this.viewContainerRef,
    }).onClosed.then(this.checkSessionStorage.bind(this));
  }

  public toggleShareButtons(): void {
    this.showShareButtons = !this.showShareButtons;
  }

  public shareFacebook(): void {
    this.shareService.facebook(this.job);
    this.analytics.trackEvent(`Shared Job: ${this.id} via Facebook`);
  }

  public shareTwitter(): void {
    this.shareService.twitter(this.job);
    this.analytics.trackEvent(`Shared Job: ${this.id} via Twitter`);
  }

  public shareLinkedin(): void {
    this.shareService.linkedin(this.job);
    this.analytics.trackEvent(`Shared Job: ${this.id} via LinkedIn`);
  }

  public emailLink(): void {
    window.open(this.shareService.emailLink(this.job));
    this.analytics.trackEvent(`Shared Job: ${this.id} via Email`);
  }

  public print(): void {
    window.print();
  }

  private goToJobList(): void {
    this.router.navigate(['/']);
  }

  private setJob(): void {
    let res: any = this.route.snapshot.data.message;
    if (res.data && res.data.length > 0) {
      this.job = res.data[0];
      this.titleService.setTitle(this.job.title);
      this.meta.updateTag({ name: 'og:title', content: this.job.title });
      this.meta.updateTag({ name: 'titter:title', content: this.job.title });
      this.meta.updateTag({ name: 'og:image', content: SettingsService.settings.companyLogoPath });
      this.meta.updateTag({ name: 'og:url', content: `${SettingsService.urlRoot}${this.router.url}` });
      this.meta.updateTag({ name: 'og:description', content: this.job.publicDescription});
      this.meta.updateTag({ name: 'twitter:description', content: this.job.publicDescription});
      this.meta.updateTag({ name: 'description', content: this.job.publicDescription});
      this.loading = false;
    } else {
      this.serverResponse.setNotFound();
      this.modalService.open(ErrorModalComponent, {
        title: TranslateService.translate('ERROR'),
        message: TranslateService.translate('MISSING_JOB_ERROR'),
      }).onClosed.then(this.goToJobList.bind(this));
    }
  }

}
