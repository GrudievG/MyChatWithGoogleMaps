var chatCtrl = angular.module('chatCtrl', ['socket', 'ui.bootstrap']);

chatCtrl.controller('chatCtrl', ['$scope', 'socket', '$cookies', function($scope, socket, $cookies) {
	
	socket.name = $cookies.get('username');
	$scope.msg= {};
	$scope.chats = [
		{
			name: "General",
			msgs: [],
			room: "general"
		},
		{
			name: "My Channel",
			msgs: [],
			room: socket.name
		}
	];

	$scope.$on('openNewChat', function(event, username) {

		$scope.chats.push({
			name: username + "'s channel",
			msgs: [],
			room: username
		});

		socket.emit('broadcasting', username);

	});

	$scope.sendMsg = function (room) {

		var message = {
			user: socket.name,
			text: $scope.msg.text,
			room: room
		};

		socket.emit('send msg', message);
		$scope.msg.text = "";

	};

	socket.on('get msg', function(message) {

		$scope.chats[0].msgs.push(message);
		$scope.$digest();

	});

	socket.on('get private msg', function(message) {

		if (message.room == socket.name) {
			$scope.chats[1].msgs.push(message);
			$scope.$digest();
		}

		else {

			for (var i = 0; i < $scope.chats.length; i++) {

				if(message.room == $scope.chats[i].room) {
					$scope.chats[i].msgs.push(message);
					$scope.$digest();
				} else continue;

			}

		}	
		
	});

	socket.on('user join', function(data) {

		$scope.chats[0].msgs.push("User " + data + " joined!");
		$scope.$digest();

	});

	socket.on('user join to private room', function(data) {

		$scope.chats[1].msgs.push("User " + data + " joined!");
		$scope.$digest();

	});

	socket.on('user left', function(data) {

		$scope.chats[0].msgs.push("User " + data + " leave");
		$scope.$digest();

	});

}]);