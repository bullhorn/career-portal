import 'angular';

export default [
    '$rootScope',
    '$location',
    '$scope',
    'searchData',
    'applyJob',
    'configuration',
    class {

        constructor($rootScope, $location, $scope, searchData, applyJob, configuration) {
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$scope = $scope;

            this.handleScope(searchData, applyJob, configuration);
            this.initialize();
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData, applyJob, configuration) {
            this.$scope.searchService = searchData;
            this.$scope.applyService = applyJob;
            this.$scope.configuration = configuration;
        }

        initialize() {
            this.$scope.applyService.initializeModel();
            this.closeModal();
        }

        closeModal() {
            this.$rootScope.modalState = 'closed';

            this.$scope.showForm = true;
            this.$scope.header = this.$scope.configuration.text.modal.apply.header;
            this.$scope.subHeader = this.$scope.configuration.text.modal.apply.subHeader;
        }

        applySuccess() {
            this.$scope.showForm = false;

            this.$scope.header = this.$scope.configuration.text.modal.thankYou.header;
            this.$scope.subHeader = this.$scope.configuration.text.modal.thankYou.subHeader;
        }

        submit(applyForm) {
            applyForm.$submitted = true;

            if(applyForm.$valid) {
                var controller = this;

                this.$scope.applyService.submit(this.$scope.searchService.currentDetailData.id, function() {
                    controller.applySuccess();
                });
            }
        }

        //#endregion
    }
];