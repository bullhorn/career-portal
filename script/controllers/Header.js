import 'angular';

export default [
    '$rootScope',
    '$location',
    '$scope',
    'searchData',
    class {

        constructor($rootScope, $location, $scope, searchData) {
            this.$rootScope = $rootScope;
            this.$location = $location;
            this.$scope = $scope;

            this.handleScope(searchData);
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData) {
            this.$scope.searchService = searchData;
        }

        goBack() {
            this.$location.path('/jobs');
        }

        //#endregion
    }
];