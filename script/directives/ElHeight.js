import 'angular';

class ElHeight {

    constructor($timeout, $rootScope, $window) {
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$window = $window;
    }

    //#region Properties

    /**
     * A dictionary that contains the collective state of an ElHeight instance.
     * 
     * @private
     * @returns { Object }
     */
    get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    get restrict() {
        return this._.restrict || (this._.restrict = 'A');
    }
    set restrict(value) {
        this._.restrict = value;
    }

    //#endregion

    //#region Methods

    link(scope, element) {
        //TODO: fix for this.$timeout, this.$window, this.$rootScope
        this.$timeout(() => {
            if (angular.element(this.$window).width() <= 850)
                this.$rootScope.topPad = { "margin-top": element[0].offsetHeight + "px" };
        }, 120);
    }

    //#endregion

}

export default [
    '$timeout',
    '$rootScope',
    '$window',
    ($timeout, $rootScope, $window) => new ElHeight($timeout, $rootScope, $window)
];
