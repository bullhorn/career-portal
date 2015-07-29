class CareerPortalModal {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/modal/modal.html',
            scope: false,
            controller: CareerPortalModalController,
            controllerAs: 'modal',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

class CareerPortalModalController {
    constructor($rootScope, $location, SearchService, ApplyService, configuration) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$location = $location;
        this.SearchService = SearchService;
        this.ApplyService = ApplyService;
        this.configuration = configuration;

        // Initialize the model
        this.ApplyService.initializeModel();
        this.closeModal();
    }

    closeModal(applyForm) {
        this.$rootScope.modalState = 'closed';

        this.showForm = true;
        this.header = this.configuration.text.modal.apply.header;
        this.subHeader = this.configuration.text.modal.apply.subHeader;

        // Clear the errors if we have the form
        if (applyForm) {
            applyForm.$setPristine();
        }
    }

    applySuccess() {
        this.showForm = false;

        this.header = this.configuration.text.modal.thankYou.header;
        this.subHeader = this.configuration.text.modal.thankYou.subHeader;
    }

    submit(applyForm) {
        applyForm.$submitted = true;

        if (applyForm.$valid) {
            var controller = this;

            this.ApplyService.submit(this.SearchService.currentDetailData.id, function () {
                controller.applySuccess();
            });
        }
    }
}

export default CareerPortalModal;