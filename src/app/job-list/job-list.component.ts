import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { SearchService } from '../services/search/search.service';
import { SettingsService } from '../services/settings/settings.service';
import { JobDetailsComponent } from './job-details/job-details.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
})
export class JobListComponent implements OnChanges {
  @Input() public filter: any;
  @Input() public filterCount: number;
  @Input() public sidebarVisible: boolean = false;
  @ViewChild(JobDetailsComponent) public jobDetails: JobDetailsComponent;
  @Output() public displaySidebar: EventEmitter<any> = new EventEmitter();

  public jobs: any[] = [];
  public title: string;
  public loading: boolean = true;
  public moreAvailable: boolean = true;
  private start: number = 0;

  constructor(private http: SearchService) {
   }

  public ngOnChanges(changes: SimpleChanges): any {
    this.getData();
  }

  public getData(loadMore: boolean = false): void {
    this.start = loadMore ? (this.start + 30) : 0;
    this.http.getjobs(this.filter, { start: this.start }).subscribe(this.onSuccess.bind(this));
  }

  public loadMore(): void {
    this.getData(true);
  }

  public openSidebar(): void {
    this.displaySidebar.emit(true);
  }

  private onSuccess(res: any): void {
    if (this.start > 0) {
      this.jobs = this.jobs.concat(res.data);
    } else {
      this.jobs = res.data;
    }
    this.moreAvailable = (res.count === 30);
    this.loading = false;
  }

}
