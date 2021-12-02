import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { join } from 'path';
import { from, Observable } from 'rxjs';
import * as fs from 'fs';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';

@Injectable()
export class ServerTranslationLoader implements TranslateLoader {

  constructor(private transferState: TransferState)  {}

    public getTranslation(locale: string): Observable<{}> {
        // Split out the language code from the locale
        const languageCode: string = (locale.split('-')[0] || '').toLowerCase();
        return from(this.getLanguageAndLocale(languageCode, locale));
    }

    private async translationFetcher(locale: string): Promise<object> {
        const assetsFolder: string = join(
          process.cwd(),
          'dist',
          'career-portal',
          'browser',
          'i18n',
        );

        return JSON.parse(fs.readFileSync(`${assetsFolder}/${locale}.json`, 'utf8'));
    }

    private async getLanguageAndLocale(language: string, locale: string): Promise<object> {
      const languageKey: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + language,
      );
      const fallbackKey: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + locale,
      );
      let fallbackTranslations: any = {};
      let translations: any = {};
      try {
            fallbackTranslations = await this.translationFetcher(language);
            this.transferState.set(fallbackKey, fallbackTranslations);
        } catch (e) {
            fallbackTranslations = {};
        }
      try {
            translations = await this.translationFetcher(locale);
            this.transferState.set(languageKey, translations);
        } catch (e) {
            translations = {};
        }
      return {...fallbackTranslations, ...translations};
    }

}
