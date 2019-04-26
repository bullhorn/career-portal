import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AnalyticsService {
private trackingId: string;
constructor(private settings: SettingsService) {this.trackingId = this.settings.getSetting('integrations').googleAnalytics.trackingId; }

  public trackEvent(action: string): void {
    if (this.trackingId) {
      (<any>window).ga('send', {
        hitType: 'event',
        eventCategory: 'Career Portal',
        eventAction: action,
        eventLabel: action,
      });
    }
  }
}