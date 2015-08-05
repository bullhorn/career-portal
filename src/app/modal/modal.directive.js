class CareerPortalModalController {
    constructor(SharedData, $location, SearchService, ApplyService, configuration, locale, $filter) {
        'ngInject';

        this.SharedData = SharedData;
        this.$location = $location;
        this.SearchService = SearchService;
        this.ApplyService = ApplyService;
        this.configuration = configuration;
        this.locale = locale;
        this.$filter = $filter;

        // Initialize the model
        this.ApplyService.initializeModel();
        this.closeModal();
    }

    closeModal(applyForm) {
        this.SharedData.modalState = 'closed';

        this.showForm = true;

        this.locale.ready('modal').then(angular.bind(this, function () {
            this.header = this.locale.getString('modal.modalHeading');
            this.subHeader = this.locale.getString('modal.modalSubHeading');
        }));

        // Clear the errors if we have the form
        if (applyForm) {
            applyForm.$setPristine();
        }
    }

    validateResume(file) {
        if (!file) {
            this.updateUploadClass(false);
            return false;
        }

        // First check the type
        var fileArray = file.name.split('.');
        var fileExtension = fileArray[fileArray.length - 1];

        if (this.configuration.search.acceptedResumeTypes.indexOf((fileExtension || '').toLowerCase()) === -1) {
            this.resumeUploadErrorMessage = (fileExtension || '').toUpperCase() + ' ' + this.$filter('i18n')('modal.resumeInvalidFormat');
            this.updateUploadClass(false);
            return false;
        }

        // Now check the size
        if (file.size > this.configuration.search.maxUploadSize) {
            this.resumeUploadErrorMessage = 'File is too big. (max: ' + this.configuration.search.maxUploadSize / 1000 + 'KB)';
            this.resumeUploadErrorMessage = this.$filter('i18n')('modal.resumeToBig') + '(' + this.$filter('i18n')('modal.maxLabel') + ': ' + this.configuration.search.minUploadSize / 1000 + 'KB)';
            this.updateUploadClass(false);
            return false;
        }

        if (file.size < this.configuration.search.minUploadSize) {
            this.resumeUploadErrorMessage = this.$filter('i18n')('modal.resumeToSmall') + '(' + this.$filter('i18n')('modal.minLabel') + ': ' + this.configuration.search.minUploadSize / 1000 + 'KB)';
            this.updateUploadClass(false);
            return false;
        }

        this.resumeUploadErrorMessage = '';
        this.updateUploadClass(true);
        return true;
    }

    updateUploadClass(valid) {
        var $uploadContainer = document.querySelector('.upload-container');
        if ($uploadContainer) {
            $uploadContainer.classList.toggle('valid', valid);
        }
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
        this.locale.ready('modal').then(angular.bind(this, function () {
            this.header = this.locale.getString('modal.successHeading');
            this.subHeader = this.locale.getString('modal.successSubHeading');
        }));
    }

    submit(applyForm) {
        applyForm.$submitted = true;
        this.isSubmitting = true;
        if (applyForm.$valid) {
            var controller = this;

            this.ApplyService.submit(this.SearchService.currentDetailData.id, function () {
                controller.applySuccess();
                controller.isSubmitting = false;
            }, function () {
                controller.isSubmitting = false;
            });
        }
    }
}

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

export default CareerPortalModal;