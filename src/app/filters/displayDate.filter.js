export default function (configuration, moment) {
    'ngInject';

    return function (date) {
        var momentDate = moment(date);
        var now = moment();

        if (now.diff(momentDate, 'days') > 1) {
            if (configuration.defaultLocale === 'en-EU') {
                return momentDate.format('DD/MM/YY');
            } else {
                return momentDate.format('MM/DD/YY');
            }
        }
        return momentDate.fromNow();
    }
};