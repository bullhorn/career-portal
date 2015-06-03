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
            this.initialize();
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData) {
            this.$rootScope.gridState = 'list-view';

            this.$scope.searchService = searchData;
        }

        initialize() {
            if (this.$scope.searchService.config.loadJobsOnStart) {
                this.$scope.searchService.makeSearchApiCall();
            }

            this.$scope.searchService.getCountBy('address.state', this.setLocations());
            this.$scope.searchService.getCountBy('publishedCategory.id', this.setCategories());

            this.$scope.$watchCollection('searchService.searchParams.category', this.updateFilterCountsAnonymous());
            this.$scope.$watchCollection('searchService.searchParams.location', this.updateFilterCountsAnonymous());
        }

        setLocations() {
            var controller = this;

            return function(locations) {
                controller.$scope.locations = controller.sortCheckboxes(locations);
            };
        }

        setCategories() {
            var controller = this;

            return function(categories) {
                controller.$scope.categories = controller.sortCheckboxes(categories);
            };
        }

        capitalize(value) {
            if(typeof value === 'object') {
                var key = Object.keys(value)[0].toString();

                var capitalized = this.capitalize(key);

                if(key != capitalized) {
                    value[capitalized] = value[key];

                    delete value[key];
                }

                return value;
            }

            return value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

        sortCheckboxes(checkboxes) {
            var controller = this;

            return checkboxes.sort(function(checkbox1, checkbox2) {
                var key1 = Object.keys(checkbox1)[0];
                var key2 = Object.keys(checkbox2)[0];

                if(checkbox1[key1] === 0) {
                    if(checkbox2[key2] === 0) {
                        if(key1 < key2) {
                            return -1;
                        } else if(key1 > key2) {
                            return 1;
                        }

                        return 0;
                    }

                    return 1;
                } else if(checkbox2[key2] === 0) {
                    return -1;
                }

                if(key1 < key2) {
                    return -1;
                } else if(key1 > key2) {
                    return 1;
                }

                if(checkbox1[key1] < checkbox2[key2]) {
                    return -1;
                } else if(checkbox1[key1] > checkbox2[key2]) {
                    return 1;
                }

                return 0;
            }).map(function(value) {
                return controller.capitalize(value);
            });
        }

        updateCountsByIntersection(oldCounts, newCounts) {
            var controller = this;

            angular.forEach(oldCounts, function (oldCount, i) {
                var key1 = controller.capitalize(Object.keys(oldCount)[0].toString());

                var found = false;

                angular.forEach(newCounts, function (newCount, i2) {
                    var key2 = Object.keys(newCount)[0].toString();

                    if (key1 == controller.capitalize(key2)) {
                        oldCounts[i][key1] = newCounts[i2][key2];
                        found = true;
                    }
                });

                if (!found) {
                    oldCounts[i][key1] = 0;
                }
            });
        }

        updateFilterCounts() {
            var controller = this;

            if(this.$scope.locations) {
                this.$scope.searchService.getCountBy('address.state', function (locations) {
                    controller.updateCountsByIntersection(controller.$scope.locations, locations);

                    controller.$scope.locations = controller.sortCheckboxes(controller.$scope.locations);
                });
            }

            if(this.$scope.categories) {
                this.$scope.searchService.getCountBy('publishedCategory.id', function (categories) {
                    controller.updateCountsByIntersection(controller.$scope.categories, categories);

                    controller.$scope.categories = controller.sortCheckboxes(controller.$scope.categories);
                });
            }
        }

        updateFilterCountsAnonymous() {
            var controller = this;

            return function() {
                controller.updateFilterCounts();
            };
        }

        searchJobs() {
            this.$scope.searchService.makeSearchApiCall();

            this.updateFilterCounts();
        }

        clearSearchParamsAndLoadData() {
            this.$scope.searchService.helper.clearSearchParams();
            this.$scope.searchService.makeSearchApiCall();

            this.updateFilterCounts();
        }

        switchViewStyle(type) {
            this.$rootScope.gridState = type + '-view';
        }

        goBack(state) {
            if (this.$rootScope.viewState === state) {
                this.$location.path('/jobs');
            }
        }

        //#endregion
    }
];