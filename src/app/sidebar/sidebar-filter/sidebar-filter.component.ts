import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { CheckListControl, FormUtils, NovoFormGroup, FieldInteractionApi } from 'novo-elements';

@Component({
  selector: 'app-sidebar-filter',
  templateUrl: './sidebar-filter.component.html',
  styleUrls: ['./sidebar-filter.component.scss'],
})
export class SidebarFilterComponent implements OnChanges {
  @Output() public checkboxFilter: EventEmitter<any> = new EventEmitter();
  @Input() public filter: any;
  @Input() public field: string;
  @Input() public title: string;
  public loading: boolean = true;
  public control: CheckListControl;
  public form: NovoFormGroup;
  public viewAllOptions: boolean = false;
  public lastSetValue: string[]; 
  public fieldName: string;

  constructor(private service: SearchService, private formUtils: FormUtils) { }

  public ngOnChanges(changes: SimpleChanges): void {
    switch (this.field) {
      case 'address(city,state)':
        this.fieldName = 'address';
        break;
      case 'publishedCategory(id,name)':
        this.fieldName = 'publishedCategory';
        break;
      default:
        break;
    }
    if (changes.filter.firstChange) {
      this.getFilterOptions();
    }
  }

  public toggleAllOptions(): void {
    this.viewAllOptions = !this.viewAllOptions;
  }

  private getFilterOptions(): void {
    this.loading = true; 
    this.service.getCurrentJobIds(this.filter, [this.fieldName]).subscribe(this.handleJobIdsOnSuccess.bind(this));
  }

  private handleJobIdsOnSuccess(res: any): void {
    let resultIds: number[] = res.data.map((result: any) => { return result.id; });
    this.service.getAvailableFilterOptions(resultIds, this.field).subscribe(this.setFieldOptionsOnSuccess.bind(this));
  }

  private setFieldOptionsOnSuccess(res: any): void {
    let options: { value: string | number | object, label: string}[];
    let interaction: Function;
    switch (this.field) {
      case 'address(city,state)':
        options = res.data.map((result: IAddressListResponse) => {
          return {
            value: result.address,
            label: `${result.address.city}, ${result.address.state} (${result.idCount})`,
          };
        });
        interaction = (API: FieldInteractionApi) => {
          let values: string[] = [];
          if (API.getActiveValue()) {
            values = API.getActiveValue().map((value: { city: string, state: string }) => {
              return `address.city{?^^equals}{?^^delimiter}${value.city}{?^^delimiter} AND address.state{?^^equals}{?^^delimiter}${value.state}{?^^delimiter}`;
            }); 
          }
          this.lastSetValue = values;
          this.checkboxFilter.emit(values);
        };
        break;
      case 'publishedCategory(id,name)':
        options = res.data.map((result: ICategoryListResponse) => {
          return {
            value: result.publishedCategory.id,
            label: `${result.publishedCategory.name} (${result.idCount})`,
          };
        });
        interaction = (API: FieldInteractionApi) => {
          let values: string[] = [];
          if (API.getActiveValue()) {
          values = API.getActiveValue().map((value: number) => {
            return `publishedCategory.id{?^^equals}${value}`;
          });
          }
          this.lastSetValue = values;
          this.checkboxFilter.emit(values);
        };
        break;
      default:
        break;
    }
    this.control = new CheckListControl({
      key: 'checklist',
      options: options,
      interactions: [{event: 'change', script: interaction.bind(this), invokeOnInit: false}],
    });
    this.form = this.formUtils.toFormGroup([this.control]);
    this.loading = false;
  }

}
