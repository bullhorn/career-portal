import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AnalyticsService {
private trackingId: string;
  constructor() {
    if (SettingsService.settings.integrations.googleAnalytics) {
      this.trackingId = SettingsService.settings.integrations.googleAnalytics.trackingId;
    }
  }

  public trackEvent(action: string): void {
    if (this.trackingId && !SettingsService.isServer) {
      (<any>window).ga('send', {
        hitType: 'event',
        eventCategory: 'Career Portal',
        eventAction: action,
        eventLabel: action,
      });
    }
  }
}
