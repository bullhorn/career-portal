import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { TranslateService } from 'chomsky';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const APP_CONFIG_URL: any = './app.json';
const LANGUAGE_KEY: any = makeStateKey<string>('language');

@Injectable()
export class SettingsService {

  public static settings: ISettings;
  public static isServer: boolean;
  public static urlRoot: string;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: string, @Optional() @Inject(REQUEST) protected request: Request, private transferState: TransferState) {
    SettingsService.isServer = isPlatformServer(platformId);
  }

  public async load(): Promise<any> {
    let data: any | ISettings = await this.http.get(APP_CONFIG_URL).toPromise();
    return this.setConfig(data);
  }

  public async setConfig(data: ISettings): Promise<any> {
    SettingsService.settings = data;

    let objectConfigOptions: string[] = ['service', 'additionalJobCriteria', 'integrations', 'eeoc', 'privacyConsent'];

    objectConfigOptions.forEach((option: string) => {
      if (!SettingsService.settings[option]) {
        SettingsService.settings[option] = {};
      }
    });
    
    if (SettingsService.urlRoot) {
      TranslateService.setLocation(`${SettingsService.urlRoot}i18n/`);
    }
    await TranslateService.use(this.getPreferredLanguage()).toPromise();

  }

  private getPreferredLanguage(): string {
    let supportedLanguages: string[] = SettingsService.settings.supportedLocales;
    let language: string = SettingsService.settings.defaultLocale;
    if (SettingsService.isServer) {
      language = this.request['acceptsLanguages'](supportedLanguages);
      if (!language) {
        language = SettingsService.settings.defaultLocale;
      }
      this.transferState.set(LANGUAGE_KEY, language);
    } else {
      language = this.transferState.get(LANGUAGE_KEY, navigator.language);
      if (!language) {
        language = SettingsService.settings.supportedLocales.filter((locale: string) => {
          return navigator.language === locale;
        })[0];
      }
      if (!language) {
        language = SettingsService.settings.defaultLocale;
      }
    }
    return language;
  }

}
