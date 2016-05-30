var chatCtrl = angular.module('chatCtrl', ['socket']);

chatCtrl.controller('chatCtrl', ['$scope', 'socket', '$cookies', function($scope, socket, $cookies) {
	$scope.msgs = [];
	
	
	socket.name = $cookies.get('username');
	$scope.sendMsg = function () {
		console.log(socket.name);
		$scope.msg.name = socket.name;
		socket.emit('send msg', $scope.msg);
		$scope.msg.text = "";
	};

	socket.on('get msg', function(data) {
		$scope.msgs.push(data);
		$scope.$digest();
	});

	socket.on('user join', function(data) {
		$scope.msgs.push("User " + data + " joined!");
		$scope.$digest();
	});

	socket.on('user left', function(data) {
		$scope.msgs.push("User " + data + " leave");
		$scope.$digest();
	});
}]);