

class CareerPortalModal {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/modal/modal.html',
            scope: false,
            controller: 'CareerPortalModalController',
            controllerAs: 'modal',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

export default CareerPortalModal;
