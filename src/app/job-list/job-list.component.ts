import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search/search.service';
import { Title, Meta } from '@angular/platform-browser';
import { SettingsService } from '../services/settings/settings.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnChanges {
  @Input() public filter: any;
  @Input() public filterCount: number;
  @Input() public sidebarVisible: boolean = false;
  @Output() public displaySidebar: EventEmitter<any> = new EventEmitter();
  @Output() public showLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() public showError: EventEmitter<boolean> = new EventEmitter();

  public jobs: any[] = [];
  public title: string;
  public _loading: boolean = true;
  public moreAvailable: boolean = true;
  public total: number | '...' = '...';
  public showCategory: boolean  = SettingsService.settings.service.showCategory;
  private start: number = 0;

  constructor(private http: SearchService, private titleService: Title, private meta: Meta, private router: Router, private translate: TranslateService) {
   }

  public ngOnChanges(changes: SimpleChanges): any {
    this.getData();
  }

  public getData(loadMore: boolean = false): void {
    this.start = loadMore ? (this.start + 30) : 0;
    this.titleService.setTitle(`${SettingsService.settings.companyName} - Careers`);
    let description: string = this.translate.instant('PAGE_DESCRIPTION');
    this.meta.updateTag({ name: 'og:description', content: description });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'description', content: description });
    this.http.getjobs(this.filter, { start: this.start }).subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
  }

  public loadMore(): void {
    this.getData(true);
  }

  public openSidebar(): void {
    this.displaySidebar.emit(true);
  }

  public loadJob(jobId: number): void {
    this.router.navigate([`jobs/${jobId}`]);
    this.loading = true;
  }

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    this.showLoading.emit(value);
    this._loading = value;
  }

  private onSuccess(res: any): void {
    if (this.start > 0) {
      this.jobs = this.jobs.concat(res.data);
    } else {
      this.jobs = res.data;
    }
    this.total = res.total;
    this.moreAvailable = (res.count === 30);
    this.loading = false;
  }

  private onFailure(res: any): void {
    this.loading = false;
    this.jobs = [];
    this.total = 0;
    this.moreAvailable = false;
    this.showError.emit(true);
  }

}
