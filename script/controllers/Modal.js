import 'angular';

export default [
    '$rootScope',
    '$location',
    '$scope',
    'searchData',
    'applyJob',
    class {

        constructor($rootScope, $location, $scope, searchData, applyJob) {
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$scope = $scope;

            this.handleScope(searchData, applyJob);
            this.initialize();
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData, applyJob) {
            this.$scope.searchService = searchData;
            this.$scope.applyService = applyJob;
        }

        initialize() {
            this.$scope.applyService.initializeModel();
            this.closeModal();
        }

        closeModal() {
            this.$rootScope.modalState = 'closed';

            this.$scope.showForm = true;
            this.$scope.header = this.$scope.searchService.config.portalText.modal.apply.header;
            this.$scope.subHeader = this.$scope.searchService.config.portalText.modal.apply.subHeader;
        }

        applySuccess() {
            this.$scope.showForm = false;

            this.$scope.header = this.$scope.searchService.config.portalText.modal.thankYou.header;
            this.$scope.subHeader = this.$scope.searchService.config.portalText.modal.thankYou.subHeader;
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