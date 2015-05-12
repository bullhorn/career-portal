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
            config: {
                searchUrl: 'http://public.rest.api:8181/rest-services/1hs/search/JobOrder',
                showJobList: true,
                additionalQuery: 'isOpen:1',
                sort: "title",
                fields: "id,title,categories,address,employmentType,dataAdded,publicDescription",
                count: "5",
                start: "0"
            },
            searchParams: {
                textSearch: "",
                location: "",
                category: "",
                sort: "",
                count: "",
                start: "",
                total: "",
                reloadAllData: true
            },
            requestParams: {
                sort: function () {
                    return (service.searchParams.sort ? service.searchParams.sort : service.config.sort)
                },
                count: function () {
                    return (service.searchParams.count ? service.searchParams.count : service.config.count)
                },
                start: function () {
                    return (service.searchParams.start ? service.searchParams.start : service.config.start)
                },
                assemble: function () {
                    var query = '(' + service.config.additionalQuery + ')';

                    if (service.searchParams.textSearch) {
                        query += ' AND (title:' + service.searchParams.textSearch + '* OR publishedDescription:' + service.searchParams.textSearch + '*)';
                    }

                    return '?' +
                        'query=' + query + '&fields=' + service.config.fields + '&count=' + this.count() + '&start=' + this.start() + '&sort=' + this.sort();
                }
            },
            currentListData: [],
            currentDetailData: {},
            makeSearchApiCall: function () {
                if (service.searchParams.reloadAllData) {
                    service.helper.toggleViewCurrentDataList(false);
                    service.helper.emptyCurrentDataList();
                    service.helper.resetStartAndTotal();
                }

                $http({
                    method: 'GET',
                    url: service.config.searchUrl + service.requestParams.assemble()
                }).success(function (data) {
                    service.helper.updateStartAndTotal(data);
                    if (service.searchParams.reloadAllData) {
                        service.currentListData = data.data;
                        service.helper.toggleViewCurrentDataList(true);
                    } else {
                        service.currentListData.push.apply(service.currentListData, data.data);
                    }
                }).error(function () {
                    alert("error");
                });
            },
            helper: {
                emptyCurrentDataList: function () {
                    service.currentListData.length = 0;
                },
                toggleViewCurrentDataList: function (show) {
                    service.config.showJobList = show;
                },
                updateStartAndTotal: function (data) {
                    service.searchParams.total = data.total;
                    service.searchParams.start = (parseInt(service.requestParams.count()) + parseInt(service.requestParams.start()));
                },
                resetStartAndTotal: function () {
                    service.searchParams.total = 0;
                    service.searchParams.start = 0;
                },
                moreRecordsExist: function () {
                    if ((parseInt(service.searchParams.total) - parseInt(service.requestParams.start())) > 0) {
                        return true;
                    }
                    return false;
                }
            }

        };

        return service;
    }]).
    controller('JobListCtrl', function ($rootScope, $location, $timeout, $scope, $http, SearchData) {
        console.log('INIT');
        $rootScope.viewState = 'overview-closed';
        $scope.searchService = SearchData;

        $scope.loadMoreData = function () {
            SearchData.searchParams.reloadAllData = false;
            SearchData.makeSearchApiCall();
        }

        $scope.openSummary = function (id, Data) {
            SearchData.currentDetailData = Data;
            $location.path('/jobs/' + id);
        }

    }).
    controller('JobDetailCtrl', function ($rootScope, $location, $routeParams, $route, $scope, SearchData) {
        // Form data for the login modal
        $rootScope.viewState = 'overview-open';

        this.job_id = $routeParams.id;
        this.job_data = SearchData.currentDetailData;

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

        $scope.searchService = SearchData;


        SearchData.makeSearchApiCall();

        $scope.searchJobs = function () {
            SearchData.searchParams.reloadAllData = true;
            SearchData.makeSearchApiCall();
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
