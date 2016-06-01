var app = angular.module('myApp', ['chatCtrl', 'mapCtrl', 'ngRoute', 'loginCtrl', 'mainCtrl', 'ngCookies', 'authService', 'ui.bootstrap'])

	.config(['$routeProvider', '$locationProvider', 
		function($routeProvider, $locationProvider) {

		$routeProvider
		.when('/login', {
            controller: 'loginCtrl',
            templateUrl: 'partials/login.html'
        })
        .when('/home', {
            controller: 'mainCtrl',
            templateUrl: 'partials/mainPage.html'
        })
        .otherwise({redirectTo:'/login'});

	}])
	.run(['$rootScope', 'authService',
		function($rootScope, authService) {
			$rootScope.$on('$locationChangeStart', function() {
        		authService.isAuthenticated();
    		});
		}]);