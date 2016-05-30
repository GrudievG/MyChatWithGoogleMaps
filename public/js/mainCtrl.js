var mainCtrl = angular.module('mainCtrl', ['mapCtrl', 'chatCtrl']);

mainCtrl.controller('mainCtrl', ['$scope', 'socket', function($scope, socket) {
	$scope.socket  = socket.connect();
}]);