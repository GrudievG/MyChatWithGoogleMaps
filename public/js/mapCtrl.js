var mapCtrl = angular.module('mapCtrl', ['geolocation', 'socket']);

mapCtrl.controller('mapCtrl', ['$scope', 'socket', 'geolocation', '$cookies', '$rootScope', '$compile', function($scope, socket, geolocation, $cookies, $rootScope, $compile) {
	
	var map;
	var markers = [];
	var coords = {};
	$scope.disableVar = false;

	geolocation.getLocation().then(function(data) {

     	coords = {lat:data.coords.latitude, lng:data.coords.longitude};

     	initMap(coords.lat, coords.lng);

     	var socketId = {
     		location: coords,
     		name: $cookies.get('username'),
     		id: socket.id
     	};

     	socket.emit('set marker', socketId);

    });

	function initMap(lat, lng) {

  		map = new google.maps.Map(document.getElementById('map'), {
    		center: {lat: lat, lng: lng},
    		zoom: 12
  		});

	};

	$scope.addChat = function(username) {

		$rootScope.$broadcast('openNewChat', username);
		$scope.disableVar = true;

	};

	socket.on('get marker', function(data) {
		
		for (var i = 0; i < data.length; i++) {

			var marker = new google.maps.Marker({
				position: {lat: data[i].location.lat, lng: data[i].location.lng},
				title: data[i].username
			});

			var contentString = '<div id="content"><h4 class="text-center">' + data[i].username + '</h4><button class="btn btn-success" ng-click="addChat(\''+ data[i].username +'\')" ng-disabled="disableVar == true">Join to channel</button></div>';

			var compiled = $compile(contentString)($scope);

			var infowindow = new google.maps.InfoWindow({
				content: compiled[0]
			});

			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,marker);
			});

		  	markers.push({
		  		username: data[i].username,
		  		marker: marker,
		  		contentString: contentString,
		  		infowindow: infowindow
		  	});
		}

		for (var i = 0; i < markers.length; i++) {

			if (markers[i].username == $cookies.get('username')) continue;

			var marker = markers[i].marker;
			var contentString = markers[i].contentString;
			var infowindow = markers[i].infowindow;

			marker.setMap(map);

			google.maps.event.addListener(markers[i], 'click', function() {
				infowindow.open(map, marker);
			});

		}

	});

	socket.on('remove marker', function(data) {

		for (var i = 0; i < markers.length; i++) {
			markers[i].marker.setMap(null);
		}

		markers = [];

		for (var i = 0; i < data.length; i++) {
			var marker = new google.maps.Marker({
				position: {lat: data[i].location.lat, lng: data[i].location.lng},
				title: data[i].username
			});

		  	markers.push({
		  		username: data[i].username,
		  		marker: marker
		  	});
		}

		for (var i = 0; i < markers.length; i++) {
			if (markers[i].username == $cookies.get('username')) continue;
			markers[i].marker.setMap(map);
		}
		
	});

}]);