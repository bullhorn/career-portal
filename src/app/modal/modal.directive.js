class CareerPortalModal {
    constructor() {
        'ngInject';
        return {
            restrict: 'E',
            templateUrl: 'app/modal/modal.html',
            scope: false,
            controller: 'CareerPortalModalController',
            controllerAs: 'modal',
            bindToController: true,
            replace: true
        };
    }
}

export default CareerPortalModal;
