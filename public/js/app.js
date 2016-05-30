var app = angular.module('myApp', ['chatCtrl', 'mapCtrl', 'ngRoute', 'loginCtrl', 'mainCtrl', 'ngCookies'])

	.config(function($routeProvider, $locationProvider) {

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

        // $locationProvider.html5Mode(true);
	});