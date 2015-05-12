angular.module('careers', ['ngRoute', 'ngAnimate'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/jobs', {
                templateUrl: 'resources/template/joblist.html',
                controller: 'JobListCtrl as jobs'
            }).
            when('/jobs/:id', {
                templateUrl: 'resources/template/overview.html',
                controller: 'JobDetailCtrl as overview'
            }).
            otherwise({
                redirectTo: '/jobs'
            });
    }).directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    }).factory('SearchData', ['$http', function ($http) {

        var service = {};

        service = {
            searchService: {
                config: {
                    searchUrl: 'http://public.rest.api:8181/rest-services/1hs/search/JobOrder',
                    showJobList: true,
                    additionalQuery: 'isOpen:1',
                    sort: "title",
                    fields: "id,title,categories,address,employmentType,dataAdded,publicDescription",
                    count: "20",
                    start: "0"
                },
                searchParams: {
                    text: "",
                    location: "",
                    category: "",
                    sort: "",
                    count: "",
                    start: ""
                },
                requestParams: {
                    sort: function () {
                        return (service.searchService.searchParams.sort ? service.searchService.searchParams.sort : service.searchService.config.sort)
                    },
                    count: function () {
                        return (service.searchService.searchParams.count ? service.searchService.searchParams.count : service.searchService.config.count)
                    },
                    start: function () {
                        return (service.searchService.searchParams.start ? service.searchService.searchParams.start : service.searchService.config.start)
                    },
                    assemble: function () {
                        var query = '(' + service.searchService.config.additionalQuery + ')';

                        if (service.searchService.searchParams.text) {
                            query += ' AND (title:' + service.searchService.searchParams.text + '* OR publishedDescription:' + service.searchService.searchParams.text + '*)';
                        }

                        return '?' +
                            'query=' + query + '&fields=' + service.searchService.config.fields + '&count=' + this.count() + '&start=' + this.start() + '&sort=' + this.sort();

                    }
                },
                currentListData: [],
                currentDetailData: {},
                makeApiCall: function () {
                    service.searchService.config.showJobList = false;
                    service.searchService.currentListData.length = 0;
                    $http({
                        method: 'GET',
                        url: service.searchService.config.searchUrl + service.searchService.requestParams.assemble()
                    }).success(function (data) {
                        service.searchService.currentListData = data.data;
                        service.searchService.config.showJobList = true;
                    }).error(function () {
                        alert("error");
                    });
                }

            }
        };

        return service;
    }]).
    controller('JobListCtrl', function ($rootScope, $location, $timeout, $scope, $http, SearchData) {
        console.log('INIT');
        $rootScope.viewState = 'overview-closed';
        $scope.searchService = SearchData.searchService;


        this.openSummary = function (id, Data) {
            SearchData.searchService.currentDetailData = Data;
            $location.path('/jobs/' + id);
        }

    }).
    controller('JobDetailCtrl', function ($rootScope, $location, $routeParams, $route, $scope, SearchData) {
        // Form data for the login modal
        $rootScope.viewState = 'overview-open';

        this.job_id = $routeParams.id;
        this.job_data = SearchData.searchService.currentDetailData;

        this.goBack = function () {
            $location.path('/jobs');
        }

        this.applyModal = function () {
            $rootScope.modalState = 'open';
        }

        $scope.job_id = $routeParams.id;

        this.open = true;

        this.openShare = function () {

            this.open = this.open === false ? true : false;

            if (!this.open) {
                this.share = 'share-open';
            } else {
                this.share = '';
            }

        }

    }).
    controller('SideBarCtrl', function ($rootScope, $location, $scope, SearchData) {
        $rootScope.gridState = 'list-view';

        $scope.searchService = SearchData.searchService;


        SearchData.searchService.makeApiCall();

        $scope.searchJobs = function () {
            SearchData.searchService.makeApiCall();
        }


        this.switchViewStyle = function (type) {
            $rootScope.gridState = type + '-view';
        }

        this.goBack = function (state) {
            if ($rootScope.viewState === state) {
                $location.path('/jobs');
            }
        }

        this.filterCounter = function ($rootScope) {
            var counter;
        }

    }).
    controller('HeaderCtrl', function ($rootScope, $location, $scope) {
        this.goBack = function () {
            $location.path('/jobs');
        }
    }).
    controller('ModalCtrl', function ($rootScope, $location, $scope) {
        this.closeModal = function () {
            $rootScope.modalState = 'closed';
        }
    }).
    directive('elHeight', function ($timeout, $rootScope) {

        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    var elHeight = element[0].offsetHeight;
                    if ($(window).width() <= 850) {
                        $rootScope.topPad = {
                            "margin-top": elHeight + "px"
                        }
                    }
                }, 120);

            }
        }

    }).
    directive("scroll", function ($window) {
        console.log("load scroll?");
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                console.log('loading directive...');
                angular.element($window).bind('scroll', function () {
                    console.log('in scroll');
                    console.log(raw.scrollTop + raw.offsetHeight);
                    console.log(raw.scrollHeight);
                    if (this.pageYOffset >= 100) {
                        scope.boolChangeClass = true;
                        console.log('Scrolled below header.');
                    } else {
                        scope.boolChangeClass = false;
                        console.log('Header is in view.');
                    }

                    scope.$apply();
                });
            }
        }
    });

$("button[name='filters-menu']").on("click", function () {
    $('html body hgroup aside').toggle();
});
