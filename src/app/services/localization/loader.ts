import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, StateKey, TransferState } from '@angular/platform-browser';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

@Injectable()
export class TranslationLoader implements TranslateLoader {
  constructor(private http: HttpClient,  private transferState: TransferState) {}

  public getTranslation(locale: string): Observable<{}> {
    // Split out the language code from the locale
    const languageCode: string = (locale.split('-')[0] || '').toLowerCase();
    return from(this.getLanguageAndLocale(languageCode, locale));
  }

  private async translationFetcher(locale: string): Promise<object> {
    return await this.http.get(`i18n/${locale}.json`).toPromise();
  }

  private async getLanguageAndLocale(
    language: string,
    locale: string,
  ): Promise<object> {
    const languageKey: StateKey<number> = makeStateKey<number>(
      'transfer-translate-' + language,
    );
    const fallbackKey: StateKey<number> = makeStateKey<number>(
      'transfer-translate-' + locale,
    );

    let fallbackTranslations: any = {};
    let translations: any = {};
    try {
      fallbackTranslations = this.transferState.get(fallbackKey, null);
      if (!fallbackTranslations) {
        fallbackTranslations = await this.translationFetcher(language);
      }
    } catch (e) {
      fallbackTranslations = {};
    }
    try {
      translations = this.transferState.get(languageKey, null);
      if (!translations) {
        translations = await this.translationFetcher(locale);
      }
    } catch (e) {
      translations = {};
    }
    return { ...fallbackTranslations, ...translations };
  }
}
