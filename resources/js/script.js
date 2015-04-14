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
controller('JobListCtrl', function( $rootScope, $location, $timeout, $scope) {
  console.log('INIT');
	$rootScope.viewState = 'overview-closed';
	  // Form data for the login modal
    //$scope.view = 'resources/template/jobgrid.html'

    this.data = [ {
        "id" : 3501,
        "title" : "Account Supervisor - integrated agency - Metrowest",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 104669,
                "name" : "Administrative"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Temporary",
        "dateAdded" : 1326738770830,
        "_score" : 1.0
    }, {
        "id" : 4087,
        "title" : "Display & Social Manager",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Permanent",
        "dateAdded" : 1307477347270,
        "_score" : 1.0
    }, {
        "id" : 4086,
        "title" : "Client Success Manager",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Account Services"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Permanent",
        "dateAdded" : 1307477339840,
        "_score" : 1.0
    }, {
        "id" : 4085,
        "title" : "Senior Account Manager",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Permanent",
        "dateAdded" : 1307477330883,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Senior Campaign Manager, SEM",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Human Resources"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Permanent",
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "SEM Campaign Manager",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Account Services"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Temporary",
        "dateAdded" : 1289487666677,
        "_score" : 1.0
    }, {
        "id" : 4066,
        "title" : "Implementation Manager",
        "categories" : {
            "total" : 1,
            "data" : [ {
                "id" : 99636,
                "name" : "Media"
            } ]
        },
        "location" : "Boston, MA",
        "type" : "Temporary",
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
        "location" : "Boston, MA",
        "type" : "Temporary",
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
        "location" : "Boston, MA",
        "type" : "Temporary",
        "dateAdded" : 1289399430630,
        "_score" : 1.0
    }];

	this.openSummary = function(id, Data){
    $rootScope.job_data = Data;
    $location.path('/jobs/'+id);
  }

}).
controller('JobDetailCtrl', function($rootScope, $location, $routeParams, $route, $scope) {
  // Form data for the login modal
	$rootScope.viewState = 'overview-open';

	this.job_id = $routeParams.id;
  this.job_data = $rootScope.job_data;

	this.goBack = function(){
		$location.path('/jobs');
	}

  $scope.job_id = $routeParams.id;

}).
controller('SideBarCtrl', function($rootScope, $location) {
  $rootScope.gridState = 'list-view';

	this.switchViewStyle = function(type){
		$rootScope.gridState = type + '-view';
	}

  this.goBack = function(state) {
    if($rootScope.viewState === state) {
      $location.path('/jobs');
    }
  }

}).
controller('HeaderCtrl', function($rootScope, $location, $scope) {
  this.goBack = function(){
		$location.path('/jobs');
	}
}).
directive('elHeight',function($timeout, $rootScope) {

    return {
      restrict: 'A',
      link: function(scope, element) {
        $timeout(function(){
          var elHeight = element[0].offsetHeight;
          console.log(element[0].offsetHeight);
          if ($(window).width() <= 900) {
            $rootScope.topPad = {
              "margin-top": elHeight+"px"
            }
          }
        }, 120);

      }
    }

});

$("button[name='filters-menu']").on("click",function(){
  $('html body hgroup aside').toggle();
});
