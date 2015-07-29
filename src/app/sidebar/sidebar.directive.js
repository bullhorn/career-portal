class CareerPortalSidebar {
    constructor() {
        'ngInject';

        let directive = {
            restrict: 'E',
            templateUrl: 'app/sidebar/sidebar.html',
            scope: false,
            controller: CareerPortalSidebarController,
            controllerAs: 'sidebar',
            bindToController: true,
            replace: true
        };

        return directive;
    }
}

class CareerPortalSidebarController {
    constructor($rootScope, $location, configuration, SearchService, $timeout) {
        'ngInject';

        $rootScope.gridState = 'list-view';

        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$timeout = $timeout;
        this.gridState = $rootScope.gridState;
        this.configuration = configuration;
        this.SearchService = SearchService;

        this.locationLimitTo = 8;
        this.categoryLimitTo = 8;

        if (this.configuration.search.loadJobsOnStart) {
            this.SearchService.findJobs();
        }

        this.SearchService.getCountByLocation(this.setLocations());
        this.SearchService.getCountByCategory(this.setCategories());
    }

    updateLocationLimitTo(value) {
        this.locationLimitTo = value;
    }

    updateCategoryLimitTo(value) {
        this.categoryLimitTo = value;
    }

    setLocations() {
        var controller = this;

        return function (locations) {
            controller.locations = locations.filter(function (location) {
                return location && location.address && location.address.city && location.address.state;
            });
        };
    }

    setCategories() {
        var controller = this;

        return function (categories) {
            controller.categories = categories.filter(function (category) {
                return category && category.publishedCategory && category.publishedCategory.name && category.publishedCategory.name.length;
            });
        };
    }

    updateCountsByIntersection(oldCounts, newCounts, getID, getLabel) {
        if (!getLabel) {
            getLabel = getID;
        }

        angular.forEach(oldCounts, function (oldCount) {
            var found = false;

            angular.forEach(newCounts, function (newCount) {
                if (getID.call(oldCount) === getID.call(newCount)) {
                    oldCount.idCount = newCount.idCount;

                    found = true;
                }
            });

            if (!found) {
                oldCount.idCount = 0;
            }
        });

        oldCounts.sort(function (count1, count2) {
            var name1 = getLabel.call(count1);
            var name2 = getLabel.call(count2);

            if (name1 < name2) {
                return -1;
            } else if (name1 > name2) {
                return 1;
            } else {
                var idCount1 = count1.idCount;
                var idCount2 = count2.idCount;

                return idCount2 - idCount1;
            }
        });
    }

    updateFilterCounts() {
        var controller = this;

        if (this.locations) {
            this.SearchService.getCountByLocation(function (locations) {
                controller.updateCountsByIntersection(controller.locations, locations, function () {
                    return this.address.city + ',' + this.address.state;
                });
            });
        }

        if (this.categories) {
            this.SearchService.getCountByCategory(function (categories) {
                controller.updateCountsByIntersection(controller.categories, categories, function () {
                    return !this.publishedCategory ? null : this.publishedCategory.id;
                }, function () {
                    return !this.publishedCategory ? null : this.publishedCategory.name;
                });
            });
        }
    }

    updateFilterCountsAnonymous() {
        var controller = this;

        return function () {
            controller.updateFilterCounts();
        };
    }

    switchViewStyle(type) {
        this.$rootScope.gridState = type + '-view';
        this.gridState = type + '-view';
    }

    searchJobs() {
        this.SearchService.searchParams.reloadAllData = true;
        this.SearchService.findJobs();

        this.updateFilterCounts();
    }

    clearSearchParamsAndLoadData() {
        this.SearchService.helper.clearSearchParams();
        this.SearchService.searchParams.reloadAllData = true;
        this.SearchService.findJobs();

        this.updateFilterCounts();
    }

    goBack() {
        if (this.$rootScope.viewState === 'overview-open') {
            this.$location.path('/jobs');
        }
    }

    searchOnDelay() {
        if (this.searchTimeout) {
            this.$timeout.cancel(this.searchTimeout);
        }

        this.searchTimeout = this.$timeout(angular.bind(this, function () {
            this.searchJobs();
        }), 250);
    }
}

export default CareerPortalSidebar;