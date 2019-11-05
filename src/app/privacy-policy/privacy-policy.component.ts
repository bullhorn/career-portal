import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  public loading: boolean = true;
  public data: any;

  constructor(private http: HttpClient, private domSanitize: DomSanitizer) { }

  public ngOnInit(): void {
    this.http.get('./static/privacy-policy.html', {responseType: 'text'}).subscribe(this.handlePolicyOnSuccess.bind(this));
  }

  private handlePolicyOnSuccess(data: any): void {
    this.data = this.domSanitize.bypassSecurityTrustHtml(data);
    this.loading = false;
  }

}
