var mainCtrl = angular.module('mainCtrl', ['mapCtrl', 'chatCtrl', 'authService']);

mainCtrl.controller('mainCtrl', ['$scope', 'socket', 'authService', 
	function($scope, socket, authService) {

	$scope.logout  = function() {
		authService.logout();
	};
	
}]);