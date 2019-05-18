import { Component, Output, EventEmitter, HostBinding, Input } from '@angular/core';
import { SettingsService } from '../services/settings/settings.service';
import { NovoFormGroup } from 'novo-elements';
import { SearchService } from '../services/search/search.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  @Output() public newFilter: EventEmitter<any> = new EventEmitter();
  @HostBinding('class.active') @Input() public display: boolean = false;

  public filterUrl: any;
  public controls: any[] = [];
  public updateFilterOptions: Function;
  public sidebarForm: NovoFormGroup;
  public keyword: string = '';
  public timeout: any;
  public loading: boolean = false;
  public filter: object = {};

  constructor(private searchService: SearchService) {}

  public searchOnDelay(): void {
    const keywordSearchFields: string[] = SettingsService.settings.service.keywordSearchFields;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      let searchString: string = '';
      keywordSearchFields.forEach((field: string, index: number) => {
        if (index > 0) {
          searchString += ' OR ';
        }
        searchString += `${field}{?^^equals}${this.keyword}*`;
      });
      delete this.filter['ids'];
      this.filter['keyword'] = searchString;
      this.searchService.getCurrentJobIds(this.filter, []).subscribe(this.handleJobIdsOnSuccess.bind(this));
    }, 250);
  }

  public updateFilter(field: string, httpFormatedFilter: string | string[]): void {
    delete this.filter['keyword'];
    this.filter[field] = httpFormatedFilter;
    let filter: object = {};
    Object.assign(filter, this.filter);
    this.filter = filter; // triggering angular change detection
    this.newFilter.emit(this.filter);
  }

  private handleJobIdsOnSuccess(res: any): void {
    let resultIds: number[] = res.data.map((result: any) => { return result.id; });
    if (resultIds.length === 0) {
      resultIds.push(-1);
    }
    this.updateFilter('ids', `id IN (${resultIds.toString()})`);
  }
}
