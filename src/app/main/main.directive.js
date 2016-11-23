class MainController {
    constructor(SharedData) {
        'ngInject';
        this.SharedData = SharedData;
    }

    closeFilters() {
        let $portalCanvas = document.querySelector('.portal-canvas');
        let $mask = document.querySelector('#mask');

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
        return {
            restrict: 'E',
            templateUrl: 'app/main/main.html',
            scope: false,
            controller: MainController,
            controllerAs: 'main',
            bindToController: true,
            replace: true
        };
    }
}

export default Main;

