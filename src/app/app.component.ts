import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SettingsService } from './services/settings/settings.service';
import { Meta } from '@angular/platform-browser';
import { NovoToastService, NovoModalService } from 'novo-elements';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title: string = SettingsService.settings.companyName;

  constructor(
    private router: Router,
    private meta: Meta,
    private ref: ViewContainerRef,
    private toastService: NovoToastService,
    private modalService: NovoModalService,
  ) {
    if (SettingsService.settings.integrations.googleSiteVerification) {
      this.meta.updateTag({
        name: 'google-site-verification',
        content:
          SettingsService.settings.integrations.googleSiteVerification
            .verificationCode,
      });
    }
    let trackingId: string = '';
    if (SettingsService.settings.integrations.googleAnalytics) {
      trackingId =
        SettingsService.settings.integrations.googleAnalytics.trackingId;
    }
    if (trackingId && !SettingsService.isServer) {
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('create', trackingId, 'auto');
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });
    }
  }
  public ngOnInit(): void {
    this.toastService.parentViewContainer = this.ref;
    this.modalService.parentViewContainer = this.ref;
  }
}
