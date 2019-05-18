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
  private idList: any[] = [];
  private idLoopCount: number = 0;
  private isFormSet: boolean = false;

  constructor(private service: SearchService, private settings: SettingsService, private ref: ChangeDetectorRef, private formUtils: FormUtils) { this.interactionSetup(); }

  public ngOnInit(): void {
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
      this.service.getCurrentJobIds(this.filterForm).subscribe((response: any) => {
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
  }

  public clearForm(): void {
    for (let filter in this.filterForm) {
      this.filterForm[filter] = [];
    }
    this.filter.emit(this.filterForm);
  }

  public closeSidebar(): void {
    this.display = false;
    this.displaySidebar.emit(false);
  }

}
