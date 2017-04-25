// first parameter is th name of the app,
// second parameter is the list of dependecies
var app = angular.module('myApp',["ngRoute"]);

 app.config(function($routeProvider) {
    $routeProvider
     .when("/", {
         templateUrl : "log.html"
     });
 });

app.controller('loginController', loginController);
//dependency injection
loginController.$inject=['$scope', '$http', '$window'];
function loginController($scope, $http, $window){

	$scope.login = function(){
		$scope.loginData = {};
	var logObject = {
		Api_key: "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
 		User_name: $scope.loginData.name,
 		Password:($scope.loginData.pw)
	};
	$http({
		method: 'POST',
		url:'http://aaibian-ad3rhy2.rhcloud.com/aaibian/user/login',
		data:JSON.stringify(logObject),
		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	})
	.then(function(response) {

					console.log(response.status);
					console.log(response.data.valid);
					if(response.data.valid){
						$window.location.href='/home.html';

					}
					else
					{
						$window.location.href='homeFalse.html';
					}
    });
	}
}
