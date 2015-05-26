import 'angular';

class ElHeight {

    constructor($timeout, $rootScope, $window) {
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$window = $window;
    }

    //#region Properties

    get restrict() {
        return 'A';
    }

    //#endregion

    //#region Methods

    link(scope, element) {
        //??? should this be $interval?
        this.$timeout(() => {
            if (angular.element(this.$window).width() <= 850) {
                this.$rootScope.topPad = { 'margin-top': `${element[0].offsetHeight}px` };
            }
        }, 120);
    }

    //#endregion

}

export default [
    '$timeout',
    '$rootScope',
    '$window',
    ($timeout, $rootScope, $window) => {
        let elHeight = new ElHeight($timeout, $rootScope, $window);
        
        return {
            restrict: elHeight.restrict,
            link: function() { elHeight.link(...arguments); }
        };
    }
];
