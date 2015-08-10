class CareerPortalHeaderController {
    constructor(configuration, $location, SearchService) {
        'ngInject';

        this.SearchService = SearchService;
        this.$location = $location;
        this.configuration = configuration;
    }

    toggleFilters() {
        var $portalCanvas = document.querySelector('.portal-canvas');
        var $mask = document.querySelector('#mask');

        if ($portalCanvas) {
            $portalCanvas.classList.toggle('show-nav');
        }

        if ($mask) {
            $mask.classList.toggle('active');
        }
    }

    goBack() {
        this.$location.path('/jobs');
    }
}

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

export default CareerPortalHeader;