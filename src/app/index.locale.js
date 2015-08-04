function localeConfig(configuration, localeConf, localeSupported) {
    'ngInject';

    localeConf.basePath = 'res';
    localeConf.defaultLocale = configuration.defaultLocale;
    localeConf.sharedDictionary = 'common';
    localeConf.fileExtension = '.json';
    localeConf.persistSelection = true;
    localeConf.cookieName = 'COOKIE_LOCALE_LANG';
    localeConf.observableAttrs = new RegExp('^data-(?!ng-|i18n)');
    localeConf.delimiter = '::';

    localeSupported.push(...configuration.localeSupported);
}

export default localeConfig;