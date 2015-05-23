angular
    .module('careers', ['ngRoute', 'ngAnimate', 'ngSanitize', 'checklist-model'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/jobs', {
                templateUrl: 'view/joblist.html',
                controller: 'JobListCtrl as jobs'
            }).
            when('/jobs/:id', {
                templateUrl: 'view/overview.html',
                controller: 'JobDetailCtrl as overview'
            }).
            otherwise({
                redirectTo: '/jobs'
            });
    })
    .directive('customNgEnter', function() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.customNgEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .factory('SearchData', ['$http', function($http) {

        var service = {};

        service = {
            config: {
                searchUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/search/JobOrder',
                additionalQuery: 'isOpen:1',
                sort: "-dateAdded",
                fields: "id,title,categories[10],address,employmentType,dateAdded,publicDescription",
                count: "20",
                start: "0",
                loadJobsOnStart: true,
                portalText: {
                    companyName: 'Acme Staffing',
                    joblist: {
                        header: "Open Jobs",
                        loadMoreData: "Load more..."
                    },
                    overview: {
                        header: "Job Description",
                        applyButtonLabel: 'Apply now'
                    },
                    sidebar: {
                        searchPlaceholder: 'Keyword Search',
                        locationHeader: 'Location',
                        categoryHeader: 'Category'
                    },
                    modal: {
                        uploadResumeFile: 'Upload Resume File',
                        apply: {
                            header: 'Before You Apply...',
                            subHeader: 'Please let us know who you are and upload your resume'
                        },
                        thankYou: {
                            header: 'Thank you!',
                            subHeader: 'Thank you for submitting your online application'
                        }
                    }
                }
            },
            searchParams: {
                textSearch: "",
                location: [],
                category: [],
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

                assembleUsingAll: function(groupBy, field) {
                    var query = '(' + service.config.additionalQuery + ')';

                    if (service.searchParams.textSearch) {
                        query += ' AND (title:' + service.searchParams.textSearch + '* OR publishedDescription:' + service.searchParams.textSearch + '*)';
                    }

                    if(service.searchParams.category.length > 0) {
                        query += ' AND (';

                        var first = true;
                        for(var i = 0; i < service.searchParams.category.length; i++) {
                            if(!first) {
                                query += ' OR ';
                            } else {
                                first = false;
                            }

                            query += 'categories.id:'+service.searchParams.category[i];
                        }

                        query += ')';
                    }

                    if(service.searchParams.location.length > 0) {
                        query += ' AND (';

                        var first = true;
                        for(var i = 0; i < service.searchParams.location.length; i++) {
                            if(!first) {
                                query += ' OR ';
                            } else {
                                first = false;
                            }

                            query += 'address.city:"'+service.searchParams.location[i]+'"';
                        }

                        query += ')';
                    }

                    var count;
                    var sort;

                    if(groupBy) {
                        count = '&groupByCount='+field;
                        sort = '&sort='+field;
                    } else {
                        count = '&count='+this.count();
                        sort = '&sort='+this.sort();
                    }

                    return '?' +
                        'query=' + query + '&fields=' + service.config.fields + count + '&start=' + this.start() + sort+'&useV2=true';
                },
                assemble: function () {
                    return this.assembleUsingAll(false);
                },
                assembleForCategories: function(categoryID, idToExclude) {
                    var query = '(' + service.config.additionalQuery + ') AND categories.id:'+categoryID;

                    if(idToExclude && parseInt(idToExclude) > 0) {
                        query += ' NOT id:'+idToExclude;
                    }

                    return '?' +
                        'query=' + query + '&fields=' + service.config.fields + '&count=' + this.count() + '&start=0&sort=' + this.sort()+'&useV2=true';
                },
                assembleForGroupBy: function(field) {
                    return this.assembleUsingAll(true, field);
                },
                assembleForFind: function(jobID) {
                    var query = '(' + service.config.additionalQuery + ') AND id:'+jobID;

                    return '?'+
                        'query=' + query + '&fields=' + service.config.fields + '&count=1&start=0&sort=' + this.sort()+'&useV2=true';
                }
            },
            currentListData: [],
            currentDetailData: {},
            getCountBy : function(field, callback, errorCallback) {
                errorCallback = errorCallback || function() {};

                $http({
                    method: 'GET',
                    url: service.config.searchUrl + service.requestParams.assembleForGroupBy(field)
                }).success(function (data) {
                    if(data && data.data.length > 0) {
                        callback(data.data);
                    } else {
                        console.log('No group by data found for field '+field);

                        errorCallback();
                    }
                }).error(function (data) {
                    console.log(data.errorMessage);

                    errorCallback();
                });
            },
            loadJobDataByCategory : function(categoryID, callback, errorCallback, idToExclude) {
                errorCallback = errorCallback || function() {};

                $http({
                    method: 'GET',
                    url: service.config.searchUrl + service.requestParams.assembleForCategories(categoryID, idToExclude)
                }).success(function (data) {
                    if(data && data.data.length > 0) {
                        callback(data.data);
                    } else {
                        console.log('No jobs found with categoryID '+categoryID);

                        errorCallback();
                    }
                }).error(function (data) {
                    console.log(data.errorMessage);

                    errorCallback();
                });
            },
            loadJobData: function(jobID, callback, errorCallback) {
                errorCallback = errorCallback || function() {};

                $http({
                    method: 'GET',
                    url: service.config.searchUrl + service.requestParams.assembleForFind(jobID)
                }).success(function (data) {
                    if(data && data.data.length > 0) {
                        callback(data.data[0]);
                    } else {
                        errorCallback();
                    }
                }).error(function (data) {
                    console.log(data.errorMessage);

                    errorCallback();
                });
            },
            makeSearchApiCall: function () {
                if (service.searchParams.reloadAllData) {
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
                    } else {
                        service.currentListData.push.apply(service.currentListData, data.data);
                    }
                }).error(function (data) {
                    console.log(data.errorMessage);
                });
            },
            helper: {
                emptyCurrentDataList: function () {
                    service.currentListData.length = 0;
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
                },
                clearSearchParams: function () {
                    service.searchParams.textSearch = '';
                    service.searchParams.location = [];
                    service.searchParams.category = [];
                }
            }
        };

        return service;
    }])
    .factory('ApplyJob', ['$http', function ($http) {
        var service = {};

        service = {
            config: {
                applyUrl: 'http://public.bh-bos2.bullhorn.qa:8181/rest-services/1hs/apply/'
            },
            initializeModel: function() {
                if(service.storage.hasLocalStorage()) {
                    service.form = service.storage.getStoredForm();
                }
            },
            form : {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                resumeName: '',
                resumeInfo: {}
            },
            storage: {
                hasLocalStorage: function() {
                    var hasStorage = typeof(Storage) != "undefined";

                    if(!hasStorage) {
                        console.log("Local storage is not supported!");
                    }

                    return hasStorage;
                },
                getStoredForm : function() {
                    if(service.storage.hasLocalStorage()) {
                        return {
                            firstName: localStorage.getItem("firstName"),
                            lastName: localStorage.getItem("lastName"),
                            email: localStorage.getItem("email"),
                            mobile: localStorage.getItem("mobile")
                        };
                    }

                    return {};
                },
                store : function() {
                    if(service.storage.hasLocalStorage()) {
                        localStorage.setItem("firstName", service.form.firstName);
                        localStorage.setItem("lastName", service.form.lastName);
                        localStorage.setItem("email", service.form.email);
                        localStorage.setItem("mobile", service.form.mobile);
                    }
                }
            },
            requestParams: {
                firstName: function () {
                    return service.form.firstName;
                },
                lastName: function () {
                    return service.form.lastName;
                },
                email: function () {
                    return service.form.email;
                },
                phone: function () {
                    return (service.form.phone ? service.form.phone : '')
                },
                assemble: function (resume) {
                    var format = resume.name.substring(resume.name.lastIndexOf('.')+1);

                    return '?firstName='+service.requestParams.firstName()+'&lastName='+service.requestParams.lastName()+'&email='+service.requestParams.email()+'&phone='+service.requestParams.phone()+'&format='+format;
                }
            },
            submit: function(jobID, successCallback) {
                successCallback = successCallback || function() {};

                service.storage.store();

                var form = new FormData();

                form.append("resume", service.form.resumeInfo);

                var applyUrl = service.config.applyUrl+jobID+'/raw'+service.requestParams.assemble(service.form.resumeInfo);

                $http.post(applyUrl, form, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function( data ) {
                    service.form.email = data.candidate.email;
                    service.form.firstName = data.candidate.firstName;
                    service.form.lastName = data.candidate.lastName;
                    service.form.phone = data.candidate.phone;

                    service.storage.store();

                    successCallback();
                }).error(function (data) {
                    console.log(data.errorMessage);
                })
            }
        };

        return service;
    }])
    .factory('ShareSocial', ['$http', function ($http) {
        var service = {};

        service = {
            config: {
                url: {
                    facebook: 'https://www.facebook.com/dialog/share',
                    twitter: 'https://twitter.com/intent/tweet',
                    linkedin: 'https://www.linkedin.com/shareArticle'
                },
                keys: {
                    facebook: '1439597326343190'
                }
            },

            requestParams: {
                facebook: function(job) {
                    var url = encodeURIComponent(window.location.href);

                    return '?display=popup&app_id='+service.config.keys.facebook+'&href='+url+'&redirect_uri='+url;
                },
                twitter: function(job) {
                    return '?text='+service.description(job)+'&url='+encodeURIComponent(window.location.href);
                },
                linkedin: function(job) {
                    return '?mini=true&source=Bullhorn%20Carrer%20Portal&title='+service.description(job)+'&url='+encodeURIComponent(window.location.href);
                },
                email: function(job) {
                    return '?subject='+job.title+'&body='+service.description(job, window.location.href);
                }
            },

            description: function(job, url) {
                if(url) {
                    return 'Hey, check out this '+job.title+' job: '+encodeURIComponent(url);
                }

                return 'Hey, check out this '+job.title+' job!';
            },

            facebook : function(job) {
                var url = service.config.url.facebook+service.requestParams.facebook(job);

                window.open(url);
            },
            twitter : function(job) {
                var url = service.config.url.twitter+service.requestParams.twitter(job);

                window.open(url);
            },
            linkedin : function(job) {
                var url = service.config.url.linkedin+service.requestParams.linkedin(job);

                window.open(url);
            },
            email : function(job) {
                var url = 'mailto:'+service.requestParams.email(job);

                window.location.href = url;
            }
        };

        return service;
    }])
    .controller('JobListCtrl', function ($rootScope, $location, $timeout, $scope, $http, SearchData) {
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

    })
    .controller('JobDetailCtrl', function ($rootScope, $location, $routeParams, $route, $scope, SearchData, ShareSocial) {
        // Form data for the login modal
        $rootScope.viewState = 'overview-open';

        $scope.searchService = SearchData;

        this.job_id = $routeParams.id;
        $scope.job_id = $routeParams.id;

        var controller = this;

        this.loadRelatedJobs = function() {
            $scope.relatedJobs = [];

            for(var i = 0; i < controller.job_data.categories.data.length; i ++) {
                SearchData.loadJobDataByCategory(controller.job_data.categories.data[i].id, function (jobs) {
                    $scope.relatedJobs = $scope.relatedJobs.concat(jobs);
                }, function() {}, controller.job_data.id);
            }
        };

        this.loadJob = function(jobID) {
            SearchData.loadJobData(jobID, function(job) {
                controller.job_data = job;

                controller.loadRelatedJobs();
            }, function() {
                controller.goBack();
            });
        };

        if(!SearchData.currentDetailData.id) {
            controller.loadJob(this.job_id);
        } else {
            controller.job_data = SearchData.currentDetailData;

            controller.loadRelatedJobs();
        }

        this.goBack = function () {
            $location.path('/jobs');
        };

        this.shareFacebook = ShareSocial.facebook;
        this.shareTwitter = ShareSocial.twitter;
        this.shareLinkedin = ShareSocial.linkedin;
        this.shareEmail = ShareSocial.email;

        this.open = true;

        this.switchToJob = function(jobID) {
            $location.path('/jobs/' + jobID);

            controller.loadJob(jobID);
        };

        this.loadJobsWithCategory = function(categoryID) {
            SearchData.helper.emptyCurrentDataList();
            SearchData.helper.resetStartAndTotal();

            SearchData.loadJobDataByCategory(categoryID, function(jobs) {
                SearchData.currentListData = jobs;
                SearchData.searchParams.category.push(categoryID);

                controller.goBack();
            }, function() {
                SearchData.makeSearchApiCall();

                controller.goBack();
            });
        };

        this.applyModal = function () {
            $rootScope.modalState = 'open';
        };

        this.openShare = function () {
            this.open = this.open === false ? true : false;

            if (!this.open) {
                this.share = 'share-open';
            } else {
                this.share = '';
            }
        }
    })
    .controller('SideBarCtrl', function ($rootScope, $location, $scope, SearchData) {
        $rootScope.gridState = 'list-view';

        $scope.searchService = SearchData;

        if (SearchData.config.loadJobsOnStart) {
            SearchData.makeSearchApiCall();
        }

        $scope.searchJobs = function () {
            SearchData.searchParams.reloadAllData = true;
            SearchData.makeSearchApiCall();
        };

        $scope.clearSearchParamsAndLoadData = function () {
            SearchData.helper.clearSearchParams();
            SearchData.makeSearchApiCall();
        };

        SearchData.getCountBy('address.city', function(locations) {
           $scope.locations = locations;
        });

        $scope.selectedLocations = SearchData.searchParams.location;

        $scope.filterBy = function(field) {
            console.log($scope.selectedLocations);
            console.log(SearchData.searchParams.location);
            //SearchData.searchParams[field] = $scope[]
            //var indexOfValue = SearchData.searchParams[field].indexOf(value);
            //
            //if(indexOfValue < 0) {
            //    SearchData.searchParams[field].push(value);
            //} else {
            //    SearchData.searchParams[field].splice(indexOfValue, 1);
            //}

            SearchData.makeSearchApiCall();
        };

        this.switchViewStyle = function (type) {
            $rootScope.gridState = type + '-view';
        };

        this.goBack = function (state) {
            if ($rootScope.viewState === state) {
                $location.path('/jobs');
            }
        };

        this.filterCounter = function ($rootScope) {
            var counter;
        }

    })
    .controller('HeaderCtrl', function ($rootScope, $location, $scope, SearchData) {
        $scope.searchService = SearchData;

        this.goBack = function () {
            $location.path('/jobs');
        }
    })
    .controller('ModalCtrl', function ($rootScope, $location, $scope, SearchData, ApplyJob) {
        $scope.searchService = SearchData;
        $scope.applyService = ApplyJob;

        $scope.applyService.initializeModel();

        this.closeModal = function () {
            $rootScope.modalState = 'closed';
            $scope.showForm = true;
            $scope.searchService.config.portalText.modal.header=$scope.searchService.config.portalText.modal.apply.header;
            $scope.searchService.config.portalText.modal.subHeader=$scope.searchService.config.portalText.modal.apply.subHeader;
        }

        this.applySuccess = function() {
            $scope.showForm = false;
            $scope.searchService.config.portalText.modal.header=$scope.searchService.config.portalText.modal.thankYou.header;
            $scope.searchService.config.portalText.modal.subHeader=$scope.searchService.config.portalText.modal.thankYou.subHeader;
        };

        this.closeModal();

        var controller = this;

        this.submit = function(applyForm) {
            applyForm.$submitted = true;

            if(applyForm.$valid) {
                $scope.applyService.submit($scope.searchService.currentDetailData.id, function() {
                    controller.applySuccess();
                });
            }
        }
    })
    .directive('elHeight', function ($timeout, $rootScope) {
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
    })
    .directive("scroll", function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];

                angular.element($window).bind('scroll', function () {
                    if (this.pageYOffset >= 100) {
                        scope.boolChangeClass = true;
                    } else {
                        scope.boolChangeClass = false;
                    }

                    scope.$apply();
                });
            }
        }
    })
    .filter("stripHtml", function() {
        return function(text) {
            var s = String(text).replace(/<[^>]+>/gm, '');
            var out = "";

            var l = s.length;

            for (var i = 0; i < l; i++) {
                var ch = s.charAt(i);
                if (ch == '&') {
                    var semicolonIndex = s.indexOf(';', i + 1);
                    if (semicolonIndex > 0) {
                        var entity = s.substring(i + 1, semicolonIndex);
                        if (entity.length > 1 && entity.charAt(0) == '#') {
                            if (entity.charAt(1) == 'x' || entity.charAt(1) == 'X')
                                ch = String.fromCharCode(eval('0' + entity.substring(1))); //jshint ignore:line
                            else
                                ch = String.fromCharCode(eval(entity.substring(1))); //jshint ignore:line
                        } else {
                            switch (entity) {
                                case ' quot ':
                                    ch = String.fromCharCode(0x0022);
                                    break;
                                case ' amp ':
                                    ch = String.fromCharCode(0x0026);
                                    break;
                                case ' lt ':
                                    ch = String.fromCharCode(0x003c);
                                    break;
                                case ' gt ':
                                    ch = String.fromCharCode(0x003e);
                                    break;
                                case ' nbsp ':
                                    ch = String.fromCharCode(0x00a0);
                                    break;
                                default:
                                    ch = '';
                                    break;
                            }
                        }
                        i = semicolonIndex;
                    }
                }
                out += ch;
            }
            return out;
        }
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                ngModel.$render = function () {
                    var fileName = element.val();

                    if(fileName) {
                        var index = fileName.lastIndexOf('\\');

                        if(!index) {
                            index = fileName.lastIndexOf('/');
                        }

                        fileName = fileName.substring(index+1);
                    }

                    ngModel.$setViewValue(fileName);
                };

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        ngModel.$render();
                    });
                });
            }
        };
    }]);

$("button[name='filters-menu']").on("click", function () {
    $('html body hgroup aside').toggle();
});
