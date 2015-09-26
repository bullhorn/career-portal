function localeConfig(configuration, $translateProvider) {
    'ngInject';

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage(configuration.defaultLocale);

    // Set the fallback language to use if the string cannot be found in the default locale
    $translateProvider.fallbackLanguage('en');

    // For security, we set the sanitize strategy to make sure our strings are sanitized correctly
    $translateProvider.useSanitizeValueStrategy('sanitize');
}

export default localeConfig;