angular.module('careers', ['ngRoute'])
.config(function($routeProvider) {
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
}).
controller('JobListCtrl', function( $rootScope, $location, $timeout) {
    console.log('INIT');
	$rootScope.viewState = 'overview-closed';
	// Form data for the login modal
    //$scope.view = 'resources/template/jobgrid.html'

    this.data = [ {
        "id" : 3501,
        "title" : "Administrative Assistant",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 104669,
                "name" : "Administrative"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1326738770830,
        "_score" : 1.0
    }, {
        "id" : 4087,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1307477347270,
        "_score" : 1.0
    }, {
        "id" : 4086,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1307477339840,
        "_score" : 1.0
    }, {
        "id" : 4085,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1307477330883,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Senior HR Generalist",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4065,
        "title" : "Recruitment/Benefits Specialist",
        "categories" : {
            "total" : 2,
            "data" : [ {
                "id" : 104798,
                "name" : "Recruiting"
            }, {
                "id" : 99635,
                "name" : "Health & Welfare Plans"
            } ]
        },
        "type" : 1,
        "dateAdded" : 1289399430630,
        "_score" : 1.0
    }];

	this.openSummary = function(id){
		$location.path('/jobs/'+id);
	}
}).
controller('JobDetailCtrl', function($rootScope, $location, $routeParams, $route) {
    // Form data for the login modal
	$rootScope.viewState = 'overview-open';
	this.job_id = $routeParams.id;
  this.job_data = $route.current.data;

	this.goBack = function(){
		$location.path('/jobs');
	}

}).
controller('SideBarCtrl', function($rootScope) {
    $rootScope.gridState = 'list-view';

	this.switchViewStyle = function(type){
		$rootScope.gridState = type + '-view';
	}

});
