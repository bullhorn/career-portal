import { Component, Input, HostBinding, OnChanges, Renderer2, Inject } from '@angular/core';
import { JobBoardPost } from '@bullhorn/bullhorn-types';
import { SettingsService } from '../services/settings/settings.service';
import { SafeHtml, DomSanitizer, DOCUMENT } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-structured-seo',
  templateUrl: './structured-seo.component.html',
  styleUrls: ['./structured-seo.component.scss'],
})
export class StructuredSeoComponent implements OnChanges {
  @Input() public jobData: JobBoardPost;
  @HostBinding('innerHTML') public html: SafeHtml;
  constructor(private sanitizer: DomSanitizer, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, private datePipe: DatePipe) { }

  public ngOnChanges(): void {
    let jsonObject: object = {
      '@context': 'https://schema.org/',
      '@type': 'JobPosting',
      'title': this.jobData.title,
      'description': this.jobData.publicDescription,
      'datePosted': this.datePipe.transform(this.jobData.dateLastPublished, 'long'),
      'employmentType': this.jobData.employmentType,
      'hiringOrganization': {
        '@type': 'Organization',
        'name': SettingsService.settings.companyName,
        'sameAs': SettingsService.settings.companyUrl,
        'logo': SettingsService.settings.companyLogoPath,
      },
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': this.jobData.address.city,
          'addressRegion': this.jobData.address.state,
          'postalCode': this.jobData.publishedZip,
          'addressCountry': this.jobData.address.countryName,
        },
      },
      'baseSalary': {
        '@type': 'MonetaryAmount',
        'value': {
          '@type': 'QuantitativeValue',
          'value': this.jobData.salary,
          'unitText': this.jobData.salaryUnit,
        },
      },
    };
    let s: any = this._renderer2.createElement('script');
    s.type = `application/ld+json`;
    s.text = JSON.stringify(jsonObject);
    this._renderer2.appendChild(this._document.body, s);
  }

}
