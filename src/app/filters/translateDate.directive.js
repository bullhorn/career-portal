export default function ($translate) {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            translateDate: '='
        },
        link: function (scope, ele) {
            $translate('FORMATS.DATE').then(function (format) {
                var momentDate = moment(scope.translateDate);
                var now = moment();

                if (now.diff(momentDate, 'days') > 1) {
                    ele.text(momentDate.format(format));
                } else {
                    ele.text(momentDate.fromNow());
                }
            });
        }
    };
}