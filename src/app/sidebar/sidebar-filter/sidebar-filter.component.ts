import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SearchService } from '../../services/search/search.service';
import { CheckListControl, FormUtils, NovoFormGroup, FieldInteractionApi } from 'novo-elements';
import { IAddressListResponse, ICategoryListResponse } from '../../../typings';

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
  public options: any[];
  public fieldName: string;

  constructor(private service: SearchService, private formUtils: FormUtils) { }

  public ngOnChanges(changes: SimpleChanges): void {
    switch (this.field) {
      case 'publishedCategory(id,name)':
        this.fieldName = 'publishedCategory';
        break;
      default:
        this.fieldName = this.field;
        break;
    }
    this.getFilterOptions();
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
    let interaction: Function;
    switch (this.field) {
      case 'address(city)':
        this.options = res.data.map((result: IAddressListResponse) => {
          return {
            value: result.address.city,
            label: `${result.address.city} (${result.idCount})`,
          };
        }).filter((item: any) => {
          return item.value;
        });
        interaction = (API: FieldInteractionApi) => {
          let values: string[] = [];
          this.lastSetValue = API.getActiveValue();
          if (API.getActiveValue()) {
            values = API.getActiveValue().map((value: string ) => {
              return `address.city{?^^equals}{?^^delimiter}${value}{?^^delimiter}`;
            });
          }
          this.checkboxFilter.emit(values);
        };
        break;
      case 'address(state)':
        this.options = res.data.map((result: IAddressListResponse) => {
          return {
            value: result.address.state,
            label: `${result.address.state} (${result.idCount})`,
          };
        }).filter((item: any) => {
          return item.value;
        });
        interaction = (API: FieldInteractionApi) => {
          let values: string[] = [];
          this.lastSetValue = API.getActiveValue();
          if (API.getActiveValue()) {
            values = API.getActiveValue().map((value: string ) => {
              return `address.state{?^^equals}{?^^delimiter}${value}{?^^delimiter}`;
            });
          }
          this.checkboxFilter.emit(values);
        };
        break;
      case 'publishedCategory(id,name)':
        this.options = res.data
        .filter((unfilteredResult: ICategoryListResponse) => {
          return !!unfilteredResult.publishedCategory;
        })
        .map((result: ICategoryListResponse) => {
          return {
            value: result.publishedCategory.id,
            label: `${result.publishedCategory.name} (${result.idCount})`,
          };
        });
        interaction = (API: FieldInteractionApi) => {
          let values: string[] = [];
          this.lastSetValue = API.getActiveValue();
          if (API.getActiveValue()) {
          values = API.getActiveValue().map((value: number) => {
            return `publishedCategory.id{?^^equals}${value}`;
          });
          }
          this.checkboxFilter.emit(values);
        };
        break;
      default:
        break;
    }

    this.control = new CheckListControl({
      key: 'checklist',
      options: this.options,
      interactions: [{event: 'change', script: interaction.bind(this), invokeOnInit: false}],
    });
    this.formUtils.setInitialValues([this.control], {'checklist': this.lastSetValue});
    this.form = this.formUtils.toFormGroup([this.control]);
    this.loading = false;
  }

}
