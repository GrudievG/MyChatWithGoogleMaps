var mapCtrl = angular.module('mapCtrl', ['geolocation', 'socket']);

mapCtrl.controller('mapCtrl', ['$scope', 'socket', 'geolocation', '$cookies', function($scope, socket, geolocation, $cookies) {
	
	var map;
	var markers = [];
	var coords = {};

	geolocation.getLocation().then(function(data) {
     	coords = {lat:data.coords.latitude, lng:data.coords.longitude};
     	initMap(coords.lat, coords.lng);
     	var socketId = {
     		location: coords,
     		name: $cookies.get('username'),
     		id: socket.id
     	};

     	socket.emit('set marker', socketId);
     	console.log(socket.id);
    });

	function initMap(lat, lng) {
  		map = new google.maps.Map(document.getElementById('map'), {
    		center: {lat: lat, lng: lng},
    		zoom: 12
  		});
	};

	socket.on('get marker', function(data) {
		console.log(data);

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

	socket.on('remove marker', function(data) {
		console.log(data);

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

		console.log(markers);

		for (var i = 0; i < markers.length; i++) {
			if (markers[i].username == $cookies.get('username')) continue;
			markers[i].marker.setMap(map);
		}
	});

}]);