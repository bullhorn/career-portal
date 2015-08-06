class MainController {
    constructor(SharedData) {
        'ngInject';

        this.SharedData = SharedData;
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