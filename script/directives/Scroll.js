import 'angular';

class Scroll {

    constructor($window) {
        this.$window = $window;
    }

    //#region Properties

    /**
     * A dictionary that contains the collective state of an Scroll instance.
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
    ($window) => new Scroll($window)
];
