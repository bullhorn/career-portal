class CareerPortalHeader {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/header/header.html',
            scope: false,
            controller: CareerPortalHeaderController,
            controllerAs: 'header',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

class CareerPortalHeaderController {
    constructor(configuration, $location) {
        'ngInject';

        this.$location = $location;
        this.configuration = configuration;
    }

    toggleFilters() {
        $('.portal-canvas').toggleClass('show-nav');
    }

    goBack() {
        this.$location.path('/jobs');
    }
}

export default CareerPortalHeader;