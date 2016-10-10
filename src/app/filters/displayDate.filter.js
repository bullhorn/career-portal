export default function (configuration, moment) {
    'ngInject';

    return function (date) {
        let momentDate = moment(date);
        let now = moment();

        if (now.diff(momentDate, 'days') > 1) {
            if (['en-EU', 'en-GB'].indexOf(configuration.defaultLocale) !== -1) {
                return momentDate.format('DD/MM/YY');
            } else {
                return momentDate.format('MM/DD/YY');
            }
        }
        return momentDate.fromNow();
    };
}
