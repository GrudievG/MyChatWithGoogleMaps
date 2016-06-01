angular.module('authService', [])
	.service('authService', ['$cookies', '$location', 
		function($cookies, $location) {
			var authentication = {};

			authentication.isAuthenticated = function() {
				if($cookies.get('username')) {
					if ($location.path() == "" || $location.path() =="/" || $location.path() == "/login") {
						$location.path("/home");
					}
				} else {
					if ($location.path() == "" || $location.path() == "/" || $location.path() == "/login") {
				        return;
				    } else {
				    	$location.path("/login");
				    }
				}
			}

			authentication.logout = function () {
				$cookies.remove('username');
				$location.path("/login");
			}

			return authentication;
	}]);