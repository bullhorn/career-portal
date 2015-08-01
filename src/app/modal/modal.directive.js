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

    validateResume(file) {
        if (!file) {
            return false;
        }

        // First check the size
        if (file.size > this.configuration.search.maxUploadSize) {
            this.resumeUploadErrorMessage = this.configuration.text.modal.toBig + ' (max size: ' + this.configuration.search.maxUploadSize / 1000 + 'KB)';
            return false;
        }

        if (file.size < this.configuration.search.minUploadSize) {
            this.resumeUploadErrorMessage = this.configuration.text.modal.toSmall + ' (min size: ' + this.configuration.search.minUploadSize / 1000 + 'KB)';
            return false;
        }

        // Now check the type
        var fileArray = file.name.split('.');
        var fileExtension = fileArray[fileArray.length - 1];

        if (this.configuration.search.acceptedResumeTypes.indexOf((fileExtension || '').toLowerCase()) === -1) {
            this.resumeUploadErrorMessage = (fileExtension || '').toUpperCase() + ' ' + this.configuration.text.modal.invalidFormat;
            return false;
        }

        this.resumeUploadErrorMessage = '';
        return true;
    }

    getTooltipText() {
        var tooltip = '<ul>';

        this.configuration.search.acceptedResumeTypes.forEach(function (type) {
            tooltip += '<li>' + type + '</li>';
        });
        tooltip += '</ul>';
        return tooltip;
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