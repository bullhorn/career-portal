import { Component, Output, OnInit, ViewChild, EventEmitter, ChangeDetectorRef, HostBinding, Input } from '@angular/core';
import { SearchService } from '../services/search/search.service';
import { SettingsService } from '../services/settings/settings.service';
import { JobListComponent } from '../job-list/job-list.component';
import { NovoFormGroup, FormUtils, CheckListControl, PickerControl, FieldInteractionApi } from 'novo-elements';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  @Output() public filter: EventEmitter<any> = new EventEmitter();
  @HostBinding('class.active') @Input() public display: boolean = false;
  @Output() public displaySidebar: EventEmitter<any> = new EventEmitter();

  public filterUrl: any;
  public controls: any[] = [];
  public updateFilterOptions: Function;
  public sidebarForm: NovoFormGroup;
  public keyword: string = '';
  public timeout: any;
  public loading: boolean = false;
  private filterForm: any = {};
  private filterOptions: any = [];
  private updatedFilterOptions: any[] = [];
  private defaultFilters: any = {};
  private idList: any[] = [];
  private idLoopCount: number = 0;
  private isFormSet: boolean = false;

  constructor(private service: SearchService, private settings: SettingsService, private ref: ChangeDetectorRef, private formUtils: FormUtils) { this.interactionSetup(); }

  public ngOnInit(): void {
    this.getUrlFilter();
    this.getFilterOptions();
  }

  public interactionSetup(): void {
    this.updateFilterOptions = (API: FieldInteractionApi): void => {
      this.updateFilter(API.getActiveKey(), API.getActiveValue());
      this.ref.markForCheck();
    };
  }

  public searchOnDelay(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.filterForm['keyword'] = this.keyword;
      this.service.getCurrentJobIds(this.filterForm, 0).subscribe((response: any) => {
        let ids: any = response.data.map((result: any) => { return result.id; });
        this.updateFilter('id', ids.toString());
      });
    }, 250);
  }

  public updateFilter(field: string, data: any): void {
    if (typeof data === 'string' && data === '') {
      data = [];
    }
    this.filterForm[field] = data;
    this.filter.emit(this.filterForm);
    this.buildCopyUrl();
    this.getFilterOptions();
  }

  public clearForm(): void {
    for (let filter in this.filterForm) {
      this.filterForm[filter] = [];
    }
    this.filter.emit(this.filterForm);
    this.buildCopyUrl();
    this.getFilterOptions();
  }

  public closeSidebar(): void {
    this.display = false;
    this.displaySidebar.emit(false);
  }

  public buildCopyUrl(): void {
    let filterParams: string;
    for (let key in this.filterForm) {
      if (key !== 'id' && key !== 'keyword') {
        if (filterParams) {
          filterParams += this.filterForm[key] ? `&${key}=${this.filterForm[key]}` : '';
        } else {
          filterParams = this.filterForm[key] ? `${key}=${this.filterForm[key]}` : '';
        }
      }
    }
    this.filterUrl = `${window.location.href.split('?')[0]}?${filterParams}`;
  }

  private getFilterOptions(start: number = 0): void {
    this.loading = true;
    start = this.idLoopCount * 500;
    this.service.getCurrentJobIds(this.filterForm, start).subscribe(this.handleJobIdsOnSuccess.bind(this));
  }

  private handleJobIdsOnSuccess(res: any): void {
    let resultIds: number[] = res.data.map((result: any) => {return result.id; });
    if (resultIds.length > 0) {
      this.idList.push(resultIds);
    }
    if (res.count >= 500) {
      this.idLoopCount++;
      this.getFilterOptions(this.idLoopCount);
      return;
    }
    if (this.isFormSet) {
      this.updatedFilterOptions = [];
    }
    this.idLoopCount = 0;
  }

  private updateForm(): void {
    this.updatedFilterOptions.forEach(function (value: any): void {
      if (!this.filterForm[value.key] || value.options.length !== this.filterForm[value.key].length) {
        this.sidebarForm.controls[value.key].config.options = value.options;
      }
    }.bind(this));
    this.idList = [];
    this.loading = false;
    this.ref.markForCheck();
  }

  private setupForm(): void {
    this.filterOptions.sort(function ( a: any, b: any): number {
      return a.label.localeCompare(b.label);
    });
    this.filterOptions.forEach((pickerOptions: any) => {
      this.controls.push(new PickerControl(pickerOptions));
    });
    this.formUtils.setInitialValues(this.controls, this.defaultFilters);
    this.sidebarForm = this.formUtils.toFormGroup(this.controls);
    this.isFormSet = true;
    this.idList = [];
    this.loading = false;
    this.ref.markForCheck();
  }

  private getUrlFilter(): void {
    let params: any = window.location.search.substring(1).split('&');
    if (params[0]) {
      for (let i: number = params.length - 1; i >= 0; i--) {
        let splitParams: string[] = params[i].split('=');
        let key: string = splitParams[0];
        let value: string = splitParams[1];
        if (value.indexOf(',') > -1) {
          this.updateFilter(key, value.split(','));
        } else {
          this.updateFilter(key, [value]);
        }
      }
    }
  }

}
