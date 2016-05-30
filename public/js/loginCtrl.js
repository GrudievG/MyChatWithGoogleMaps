var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('loginCtrl', ['$scope', 'socket', '$location', '$cookies', function($scope, socket, $location, $cookies) {

	$scope.username = "";

	$scope.goToApp = function() {

		$cookies.put('username', $scope.username);
		$location.path("/home");

	};
}]);