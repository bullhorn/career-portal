import 'angular';
import 'angular-animate';
import 'angular-route';
import 'angular-sanitize';
import 'checklist-model';
import 'jquery';

import FileModel from './directives/FileModel';
import CustomNgEnter from './directives/CustomNgEnter';
import ElHeight from './directives/ElHeight';
import Scroll from './directives/Scroll';
import StripHtml from './filters/StripHtml';
import ApplyJob from './services/ApplyJob';
import SearchData from './services/SearchData';
import ShareSocial from './services/ShareSocial';
import JobDetail from './controllers/JobDetail';
import JobList from './controllers/JobList';
import Header from './controllers/Header';
import Modal from './controllers/Modal';

export default class {

    constructor() {
        throw new Error("Cannot invoke the constructor function of a static class.");
    }

    //#region Properties

    /**
     * A dictionary that contains the collective state of the Program.
     * 
     * @private
     * @static
     * @returns { Object }
     */
    static get _() {
        return this.__ || (this.__ = Object.create(null, {}));
    }

    /**
     * Gets a value indicating whether the Program is running.
     *
     * @static
     * @returns { Boolean }
     */
    static get running() {
        return this._.running || (this._.running = false);
    }
    /**
     * Sets a value indicating whether the Program is running. Attempts to set the value of this property
     * to any value other than true are ignored.
     * 
     * @static
     * @private
     * @param { Boolean } value
     */
    static set _running(value) {
        if (value) this._.running = value;
    }

    //#endregion

    //#region Methods

    /**
     * Bootstraps the CareerPortal angular module on the document in context.
     * 
     * @static
     */
    static run() {
        if (!this.running) {
            this._running = true;

            //??? is this button visible and used? if so, push handler into HeaderCtrl ilo ad-hoc jquery handler
            $('button[name="filters-menu"]').on('click', () => $('html body hgroup aside').toggle());

            angular
                .module('CareerPortal', ['ngRoute', 'ngAnimate', 'ngSanitize', 'checklist-model'])
                .config(['$routeProvider', $routeProvider => $routeProvider
                    .when('/jobs', {
                        templateUrl: 'view/joblist.html',
                        controller: 'JobList as jobs'
                    })
                    .when('/jobs/:id', {
                        templateUrl: 'view/overview.html',
                        controller: 'JobDetail as overview'
                    })
                    .otherwise({
                        redirectTo: '/jobs'
                    })
                ])
                .controller('SideBar', ['$rootScope', '$location', '$scope', 'searchData', function($rootScope, $location, $scope, searchData) {
                    $rootScope.gridState = 'list-view';

                    $scope.searchService = searchData;

                    if (searchData.config.loadJobsOnStart) {
                        searchData.makeSearchApiCall();
                    }

                    $scope.capitalize = function(value) {
                        if(typeof value === 'object') {
                            var key = Object.keys(value)[0].toString();

                            var capitalized = $scope.capitalize(key);

                            if(key != capitalized) {
                                value[capitalized] = value[key];

                                delete value[key];
                            }

                            return value;
                        }

                        return value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    };

                    $scope.sortLocations = function(locations) {
                        return locations.sort(function(location1, location2) {
                            var state1 = Object.keys(location1)[0];
                            var state2 = Object.keys(location2)[0];

                            if(location1[state1] < location2[state2]) {
                                return 1;
                            } else if(location1[state1] > location2[state2]) {
                                return -1;
                            }

                            return 0;
                        }).map($scope.capitalize);
                    };

                    searchData.getCountBy('address.state', function(locations) {
                        $scope.locations = $scope.sortLocations(locations);
                    });

                    searchData.getCountBy('categories', function(categories) {
                        $scope.categories = categories;
                    });

                    $scope.updateCountsByIntersection = function(oldCounts, newCounts) {
                        angular.forEach(oldCounts, function(oldCount, i) {
                            var key1 = $scope.capitalize(Object.keys(oldCount)[0].toString());

                            var found = false;

                            angular.forEach(newCounts, function(newCount, i2) {
                                var key2 = Object.keys(newCount)[0].toString();

                                if(key1 == $scope.capitalize(key2)) {
                                    oldCounts[i][key1] = newCounts[i2][key2];
                                    found = true;
                                }
                            });

                            if(!found) {
                                oldCounts[i][key1] = 0;
                            }
                        });
                    };

                    $scope.updateFilterCounts = function() {
                        searchData.getCountBy('address.state', function(locations) {
                            $scope.updateCountsByIntersection($scope.locations, locations);

                            $scope.locations = $scope.sortLocations($scope.locations);
                        });

                        searchData.getCountBy('address.state', function(categories) {
                            $scope.updateCountsByIntersection($scope.categories, categories);
                        });
                    };

                    $scope.$watchCollection('searchService.searchParams.category', $scope.updateFilterCounts);
                    $scope.$watchCollection('searchService.searchParams.location', $scope.updateFilterCounts);

                    $scope.searchJobs = function() {
                        searchData.makeSearchApiCall();

                        $scope.updateFilterCounts();
                    };

                    $scope.clearSearchParamsAndLoadData = function() {
                        searchData.helper.clearSearchParams();
                        searchData.makeSearchApiCall();
                        $scope.updateFilterCounts();
                    };

                    this.switchViewStyle = function(type) {
                        $rootScope.gridState = type + '-view';
                    };

                    this.goBack = function(state) {
                        if ($rootScope.viewState === state) {
                            $location.path('/jobs');
                        }
                    };
                }])
                .controller('JobDetail', JobDetail)
                .controller('JobList', JobList)
                .controller('Header', Header)
                .controller('Modal', Modal)
                .directive('customNgEnter', CustomNgEnter)
                .directive('elHeight', ElHeight)
                .directive('fileModel', FileModel)
                .directive("scroll", Scroll)
                .service('searchData', SearchData)
                .service('applyJob', ApplyJob)
                .service('shareSocial', ShareSocial)
                .filter("stripHtml", StripHtml);

            angular.bootstrap(document, ['CareerPortal'], { strictDi: true });
            document.body.style.display = 'block';
        }
    }

//#endregion

}