class CareerPortalSidebar {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/sidebar/sidebar.html',
            scope: false,
            controller: 'CareerPortalSidebarController',
            controllerAs: 'sidebar',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

export default CareerPortalSidebar;