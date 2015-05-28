﻿import 'angular';

export default [
    '$rootScope',
    '$location',
    '$timeout',
    '$scope',
    '$http',
    'searchData',
    class {

        constructor() {
            this.$rootScope = arguments[0];
            this.$location = arguments[1];
            this.$timeout = arguments[2];
            this.$scope = arguments[3];
            this.$http = arguments[4];

            this.handleScope(arguments[5]);
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        loadMoreData() {
            this.$scope.searchService.searchParams.reloadAllData = false;
            this.$scope.searchService.makeSearchApiCall();
        }

        openSummary(id, job) {
            this.$scope.searchService.currentDetailData = job;
            this.$location.path('/jobs/' + id);
        }

        handleScope(searchData) {
            this.$rootScope.viewState = 'overview-closed';

            this.$scope.searchService = searchData;
        }

        //#endregion
    }
];