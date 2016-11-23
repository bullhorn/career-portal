class CareerPortalSidebar {
    constructor() {
        'ngInject';
        return {
            restrict: 'E',
            templateUrl: 'app/sidebar/sidebar.html',
            scope: false,
            controller: 'CareerPortalSidebarController',
            controllerAs: 'sidebar',
            bindToController: true,
            replace: true
        };
    }
}

export default CareerPortalSidebar;
