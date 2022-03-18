import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import {
  TransferState,
  makeStateKey,
  StateKey,
} from '@angular/platform-browser';
import { ISettings } from '../../typings/settings';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import * as fs from 'fs';
import { join } from 'path';
import { stringify } from 'querystring';

const APP_CONFIG_URL: any = './app.json';
const LANGUAGE_KEY: any = makeStateKey<string>('language');

@Injectable()
export class SettingsService {
  public static settings: ISettings;
  public static isServer: boolean;
  public static isIos: boolean;
  public static urlRoot: string;
  public static loaded: boolean = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: string,
    @Optional() @Inject(REQUEST) protected request: Request,
    private transferState: TransferState,
    private translate: TranslateService,
  ) {
    SettingsService.isServer = isPlatformServer(platformId);
  }

  public async load(): Promise<void> {
    let data: any | ISettings;
    const configKey: StateKey<number> = makeStateKey<number>('app-config');
    if (SettingsService.isServer) {
      const assetsFolder: string = join(
        process.cwd(),
        'dist',
        'career-portal',
        'browser',
      );

      data = JSON.parse(
        fs.readFileSync(join(assetsFolder, 'app.json'), 'utf8'),
      );
      this.transferState.set(configKey, data);
    } else {
      data = this.transferState.get(configKey, null);
      if (!data) {
        data = await this.http.get(APP_CONFIG_URL).toPromise();
      }
      this.http.get(APP_CONFIG_URL).toPromise(); // Always retrieve in console for support folks
    }
    await this.setConfig(data);
    SettingsService.loaded = true;
  }

  public async setConfig(data: ISettings): Promise<any> {
    SettingsService.settings = data;

    const objectConfigOptions: string[] = [
      'service',
      'additionalJobCriteria',
      'integrations',
      'eeoc',
      'privacyConsent',
    ];

    objectConfigOptions.forEach((option: string) => {
      if (!SettingsService.settings[option]) {
        SettingsService.settings[option] = {};
      }
    });
    if (
      !SettingsService.settings.service.fields ||
      SettingsService.settings.service.fields.length === 0
    ) {
      SettingsService.settings.service.fields = [
        'id',
        'title',
        'publishedCategory(id,name)',
        'address(city,state,countryName)',
        'employmentType',
        'dateLastPublished',
        'publicDescription',
        'isOpen',
        'isPublic',
        'isDeleted',
        'publishedZip',
        'salary',
        'salaryUnit',
      ];
    }

    if (!SettingsService.settings.service.jobInfoChips) {
      SettingsService.settings.service.jobInfoChips = [
        'employmentType',
        {
          type: 'mediumDate',
          field: 'dateLastPublished',
        },
      ];
    }

    if (
      !SettingsService.settings.service.keywordSearchFields ||
      SettingsService.settings.service.keywordSearchFields.length === 0
    ) {
      SettingsService.settings.service.keywordSearchFields = [
        'publicDescription',
        'title',
      ];
    }
    const validTokenRegex: RegExp = /[^A-Za-z0-9]/;
    if (
      !SettingsService.settings.service.corpToken ||
      validTokenRegex.test(SettingsService.settings.service.corpToken)
    ) {
      throw new Error('Invalid Corp Token');
    }

    if (!SettingsService.settings.service.swimlane) {
      throw new Error('Invalid Swimlane');
    }
    await this.translate.use(this.getPreferredLanguage()).toPromise();

    if (!SettingsService.isServer) {
      SettingsService.isIos =
        !!navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent);
    }
  }

  private getPreferredLanguage(): string {
    let supportedLanguages: string[] = SettingsService.settings.supportedLocales || [];
    let language: string = SettingsService.settings.defaultLocale;
    if (SettingsService.isServer) {
      language = <string>this.request['acceptsLanguages'](supportedLanguages);
      if (!language) {
        language = SettingsService.settings.defaultLocale;
      }
      this.transferState.set(LANGUAGE_KEY, language);
    } else {
      language = localStorage.getItem('preferredLanguage') || this.transferState.get(LANGUAGE_KEY, undefined);

      if (!language) {
        language = SettingsService.settings.supportedLocales.filter(
          (locale: string) => {
            return navigator.language === locale;
          },
        )[0];
      }
      if (!language) {
        language = SettingsService.settings.defaultLocale;
      }
    }
    return language;
  }
}
