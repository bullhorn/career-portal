import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { NovoModalService } from 'novo-elements';
import { SettingsService } from '../../services/settings/settings.service';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { ApplyModalComponent } from './apply-modal/apply-modal.component';
import { ShareService } from '../../services/share/share.service';
import { ErrorModalComponent } from '../../error-modal/error-modal/error-modal.component';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements OnInit {
  public job: any;
  public id: string;
  public source: string;
  public loading: boolean = true;
  public title: string;
  public relatedJobs: any;
  public showShareButtons: boolean = false;
  public alreadyApplied: boolean = false;
  private APPLIED_JOBS_KEY: string = 'APPLIED_JOBS_KEY';

  constructor(
    private service: SearchService,
    private shareService: ShareService,
    private route: ActivatedRoute,
    private router: Router,
    private settings: SettingsService,
    private analytics: AnalyticsService,
    private modalService: NovoModalService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.modalService.parentViewContainer = this.viewContainerRef;
  }

  public ngOnInit(): void {
    this.title = SettingsService.settings.companyName;
    this.id = this.route.snapshot.paramMap.get('id');
    this.source = this.route.snapshot.queryParams.source;
    this.analytics.trackEvent(`Open Job: ${this.id}`);
    this.getJob();
  }

  public checkSessionStorage(): void {
    let alreadyAppliedJobs: any = sessionStorage.getItem(this.APPLIED_JOBS_KEY);
    if (alreadyAppliedJobs) {
      let alreadyAppliedJobsArray: any = JSON.parse(alreadyAppliedJobs);
      this.alreadyApplied = (alreadyAppliedJobsArray.indexOf(parseInt(this.id)) !== -1);  // tslint:disable-line
    }
  }

  public getJob(id?: number): void {
    this.loading = true;
    this.checkSessionStorage();
    this.service.openJob(id ? id : this.id).subscribe(this.onSuccess.bind(this));
  }

  public getRelatedJobs(): any {
    if (this.job && this.job.publishedCategory) {
      this.service.getjobs({ 'publishedCategory.id': [this.job.publishedCategory.id]}, {} , SettingsService.settings.service.batchSize).subscribe((res: any) => { this.relatedJobs = res.data; });
    }
  }

  public apply(): void {
    this.modalService.open(ApplyModalComponent, {
      job: this.job,
      source: this.source,
      viewContainer: this.viewContainerRef,
    }).onClosed.then(this.getJob.bind(this));
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

  private onSuccess(res: any): void {
    if (res.data.length > 0) {
      this.job = res.data[ 0 ];
      this.getRelatedJobs();
      this.loading = false;
    } else {
      this.modalService.open(ErrorModalComponent, {
        title: 'Error',
        message: 'Oops! The job you are looking for is no longer here. Click okay to return to the job list.',
      }).onClosed.then(this.goToJobList.bind(this));
    }
  }

}
