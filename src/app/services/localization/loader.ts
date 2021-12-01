import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';

@Injectable()
export class TranslationLoader implements TranslateLoader {

    getTranslation(locale: string): Observable<{}> {
        // Split out the language code from the locale
        const languageCode = (locale.split('-')[0] || '').toLowerCase();
        return from(this.getLanguageAndLocale(languageCode, locale));
    }

    async getLanguageAndLocale(language, locale) {
        let fallbackTranslations = {};
        let translations = {};
        try {
            fallbackTranslations = await this.translationFetcher(language);
        } catch (e) {
            fallbackTranslations = {};
        }
        try {
            translations = await this.translationFetcher(locale);
        } catch (e) {
            translations = {};
        }
        return {...fallbackTranslations, ...translations};
    }

    async translationFetcher(locale: string): Promise<string> {
        const translationDataResponse = await fetch(`${window.location.protocol}//${window.location.host}/i18n/${locale}.json`);
        if (!translationDataResponse.ok) {
            throw new Error('The translation file did not successfully load');
        }
        return translationDataResponse.json();
    }

}
