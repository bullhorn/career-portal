class MainController {
    constructor(SharedData) {
        'ngInject';

        this.SharedData = SharedData;
    }

    closeFilters() {
        var $portalCanvas = document.querySelector('.portal-canvas');
        var $mask = document.querySelector('#mask');

        if ($portalCanvas) {
            $portalCanvas.classList.remove('show-nav');
        }

        if ($mask) {
            $mask.classList.remove('active');
        }
    }
}

class Main {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/main/main.html',
            scope: false,
            controller: MainController,
            controllerAs: 'main',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

export default Main;