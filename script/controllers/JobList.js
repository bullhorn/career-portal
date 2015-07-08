import 'angular';

export default [
    '$rootScope',
    '$location',
    '$timeout',
    '$scope',
    '$http',
    'searchData',
    'configuration',
    class {

        constructor() {
            this.$rootScope = arguments[0];
            this.$location = arguments[1];
            this.$timeout = arguments[2];
            this.$scope = arguments[3];
            this.$http = arguments[4];

            this.handleScope(arguments[5], arguments[6]);
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        loadMoreData() {
            this.$scope.searchService.searchParams.reloadAllData = false;
            this.$scope.searchService.findJobs();
        }

        openSummary(id, job) {
            this.$scope.searchService.currentDetailData = job;
            this.$location.path('/jobs/' + id);
        }

        handleScope(searchData, configuration) {
            this.$rootScope.viewState = 'overview-closed';

            this.$scope.searchService = searchData;
            this.$scope.configuration = configuration;
        }

        //#endregion
    }
];