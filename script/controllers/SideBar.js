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
            this.initialize();
        }

        //#region Properties

        get _() {
            return this.__ || (this.__ = Object.create(null, {}));
        }

        //#endregion

        //#region Methods

        handleScope(searchData, configuration) {
            this.$rootScope.gridState = 'list-view';

            this.$scope.searchService = searchData;
            this.$scope.configuration = configuration;
        }

        initialize() {
            if (this.$scope.configuration.search.loadJobsOnStart) {
                this.$scope.searchService.findJobs();
            }

            this.$scope.searchService.getCountByLocation(this.setLocations());
            this.$scope.searchService.getCountByCategory(this.setCategories());

            this.$scope.$watchCollection('searchService.searchParams.category', this.updateFilterCountsAnonymous());
            this.$scope.$watchCollection('searchService.searchParams.location', this.updateFilterCountsAnonymous());
        }

        setLocations() {
            var controller = this;

            return function(locations) {
                controller.$scope.locations = locations;
            };
        }

        setCategories() {
            var controller = this;

            return function(categories) {
                controller.$scope.categories = categories;
            };
        }

        updateCountsByIntersection(oldCounts, newCounts, getProperty) {
            angular.forEach(oldCounts, function (oldCount) {
                var found = false;

                angular.forEach(newCounts, function (newCount) {

                    if (getProperty.call(oldCount) == getProperty.call(newCount)) {
                        oldCount.idCount = newCount.idCount;
                        found = true;
                    }
                });

                if (!found) {
                    oldCount.idCount = 0;
                }
            });

            oldCounts.sort(function(count1, count2) {
                var idCount1 = count1.idCount;
                var idCount2 = count2.idCount;

                if(idCount1 == idCount2) {
                    var name1 = getProperty.call(count1);
                    var name2 = getProperty.call(count2);

                    if(name1 < name2) {
                        return -1;
                    } else if(name1 > name2) {
                        return 1;
                    }

                    return 0;
                }

                return idCount2 - idCount1;
            });
        }

        updateFilterCounts() {
            var controller = this;

            if(this.$scope.locations) {
                this.$scope.searchService.getCountByLocation(function (locations) {
                    controller.updateCountsByIntersection(controller.$scope.locations, locations, function() {
                        return this.address.city+','+this.address.state;
                    });
                });
            }

            if(this.$scope.categories) {
                this.$scope.searchService.getCountByCategory(function (categories) {
                    controller.updateCountsByIntersection(controller.$scope.categories, categories, function() {
                        return !this.publishedCategory ? null : this.publishedCategory.id;
                    });
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
            this.$scope.searchService.searchParams.reloadAllData = true;
            this.$scope.searchService.findJobs();

            this.updateFilterCounts();
        }

        clearSearchParamsAndLoadData() {
            this.$scope.searchService.helper.clearSearchParams();
            this.$scope.searchService.searchParams.reloadAllData = true;
            this.$scope.searchService.findJobs();

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