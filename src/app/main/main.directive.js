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

class MainController {
    constructor(SharedData) {
        'ngInject';

        this.SharedData = SharedData;
    }
}

export default Main;