import {
  Component,
  Output,
  EventEmitter,
  HostBinding,
  Input,
} from '@angular/core';
import { SettingsService } from '../services/settings/settings.service';
import { NovoFormGroup } from 'novo-elements';
import { SearchService } from '../services/search/search.service';
import { Router } from '@angular/router';
import { IAdditionalLanguageOption } from '../typings/settings';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() public newFilter: EventEmitter<any> = new EventEmitter();
  @Output() public toggleSidebar: EventEmitter<boolean> = new EventEmitter();
  @HostBinding('class.active') @Input() public display: boolean = false;

  public filterUrl: any;

  public controls: any[] = [];
  public updateFilterOptions: Function;
  public sidebarForm: NovoFormGroup;
  public keyword: string = '';
  public timeout: any;
  public loading: boolean = false;
  public filter: object = {};
  public showPrivacyPolicy: boolean =
    SettingsService.settings.privacyConsent.sidebarLink;
  public languageDropdownEnabled =
    SettingsService.settings.languageDropdownOptions?.enabled &&
    !SettingsService.isServer;
  public availableLocales: IAdditionalLanguageOption[] =
    SettingsService.settings?.languageDropdownOptions?.choices || [];
  constructor(private searchService: SearchService, private router: Router) {}

  public searchOnDelay(): void {
    const keywordSearchFields: string[] =
      SettingsService.settings.service.keywordSearchFields;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      let searchString: string = '';
      if (this.keyword.trim()) {
        keywordSearchFields.forEach((field: string, index: number) => {
          if (index > 0) {
            searchString += ' OR ';
          }
          searchString += `${field}{?^^equals}${
            this.keyword.trim() ? this.keyword.trim() + '*' : ''
          }`;
        });
      }
      delete this.filter['ids'];
      if (searchString) {
        this.filter['keyword'] = searchString;
      } else {
        delete this.filter['keyword'];
      }
      this.searchService
        .getCurrentJobIds(this.filter, [])
        .subscribe(this.handleJobIdsOnSuccess.bind(this));
    }, 250);
  }

  public updateFilter(
    field: string,
    httpFormatedFilter: string | string[],
  ): void {
    delete this.filter['keyword'];
    this.filter[field] = httpFormatedFilter;
    let filter: object = {};
    Object.assign(filter, this.filter);
    this.filter = filter; // triggering angular change detection
    this.newFilter.emit(this.filter);
  }

  public hideSidebar(): void {
    this.toggleSidebar.emit(false);
  }

  public viewPrivacyPolicy(): void {
    const url: string =
      SettingsService.settings.privacyConsent.privacyPolicyUrl;
    if (url === '/privacy') {
      this.router.navigate([url]);
    } else {
      window.open(url);
    }
  }
  public setPreferredLanguage(language: string): void {
    localStorage.setItem('preferredLanguage', language);
    location.reload();
  }

  private handleJobIdsOnSuccess(res: any): void {
    let resultIds: string[] = res.data.map((result: any) => {
      return `id{?^^equals}${result.id}`;
    });
    if (resultIds.length === 0) {
      resultIds.push(`id{?^^equals}${0}`);
    }
    this.updateFilter('ids', resultIds);
  }
}
