import 'angular';

class Scroll {

    constructor($window) {
        this.$window = $window;
    }

    //#region Properties

    get restrict() {
        return 'A';
    }

    //#endregion

    //#region Methods

    link(scope) {
        //TODO: fix for this.$window
        angular
            .element(this.$window)
            .bind('scroll', () => {
                scope.boolChangeClass = this.pageYOffset >= 100;
                scope.$apply();
            });
    }

    //#endregion

}

export default [
    '$window',
    ($window) => {
        let scroll = new Scroll($window);

        return {
            restrict: scroll.restrict,
            link: function() { scroll.link(...arguments); }
        };
    }
];
