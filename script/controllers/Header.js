import 'angular';

export default [
    '$rootScope',
    '$location',
    '$scope',
    'searchData',
    'configuration',
    class {

        constructor($rootScope, $location, $scope, searchData, configuration) {
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$scope = $scope;

            this.handleScope(searchData, configuration);
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData, configuration) {
            this.$scope.searchService = searchData;
            this.$scope.configuration = configuration;
        }

        goBack() {
            this.$location.path('/jobs');
        }

        //#endregion
    }
];