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
  $scope.loginData = {};
  $scope.login = function(){
    console.log("Ahmed");

    var logObject = {
		    'api_key':  "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
 		     'email': ($scope.loginData.email),
 		     'password':($scope.loginData.password)
	       };
    console.log(logObject);
  $http({
		method: 'POST',
		url:'/aaibian/user/login',

		data:JSON.stringify(logObject),
		headers: {'Content-Type': 'application/json'}
	})
	.then(function(response) {
          console.log(response.data);
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
