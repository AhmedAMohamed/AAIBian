// first parameter is th name of the app,
// second parameter is the list of dependecies
var app = angular.module('myApp',["ngRoute"]);

 app.config(function($routeProvider) {
    $routeProvider
     .when("/login", {
         templateUrl : "/pages/log.html",
         controller : "loginController",
     })
     .when("/add_user", {
        templateUrl : "/pages/addUser.html",
        controller : "addUserController"
     }).when("/list_users", {
       templateUrl : "/pages/viewList.html",
       controller : "addUserController"
     })
 });
////////////////////////****************************   LOGIN Controller
app.controller('loginController', loginController);
//dependency injection
loginController.$inject=['$scope', '$http', '$window'];
function loginController($scope, $http, $window){
	$scope.loginData = {};
	$scope.login = function(){

	var logObject = {
		'api_key': "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
 		'email': $scope.loginData.email,
 		'password': $scope.loginData.password
	};
	console.log(logObject);
	$http({
		method: 'POST',
		url:'/aaibian/user/login',
		data:JSON.stringify(logObject),
		headers: {'Content-Type': 'application/json'}
	})
	.then(function(response) {

					console.log(response.status);
					console.log(response.data.valid);
					console.log(response.data);
					if(response.data.valid){
						$window.sessionStorage.setItem("id", response.data.result.user_id);
            if(response.data.result.privilege == "gm") {
              $window.location.href='/pages/gm.html';
            }
            else {
              $window.location.href='/pages/admin.html';
            }
					}
					else
					{
						$window.location.href='/pages/homeFalse.html';
					}
    });
	}
}

////////////////////////****************************  General Manager Controller
app.controller('addUserController', addUserController);
//dependency injection
addUserController.$inject=['$scope', '$http', '$window'];
function addUserController($scope, $http, $window){
	$scope.userData = {};
  /*
	// ADD USER Function
	$scope.opt = function(){
    console.log("HHEHEHEHEHEHEHHEHEH");
				if(num == 0 ){
					$window.location.href = '/pages/addNews.html';
				}
				else if(num == 1){
					$window.location.href = '/pages/addUser.html'
				}
				else if(num == 2){
					$window.location.href = 'pages/feedback.html'
				}

	}
  */
	///////
	$scope.addUser = function(){
  var userObject = {
      "api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
	    "user_id" : "58fe517c390ea74b3a1e78b3",
	    "privilege" : "gm",
	    "new_user" : {
		      "email" : $scope.userData.email,
		      "privilege" : "gm"
	       }
	};
	console.log(userObject);
	$http({
		method: 'POST',
		url:'/aaibian/admin/add_user',
		data:JSON.stringify(userObject),
		headers: {'Content-Type': 'application/JSON'}
	})
	.then(function(response) {

					console.log(response.data);
					console.log(response.data.valid);
					console.log(response);
					if(response.data.valid){
						$window.location.href='/pages/created.html';

					}
					else
					{
						$window.location.href='/pages/homeFalse.html';
					}
    });
	}
}


app.controller('getUsersController', getUsersController);
//dependency injection
getUsersController.$inject=['$scope', '$http', '$window'];
function getUsersController($scope, $http, $window){
	$scope.userData = {};
	$scope.getUsers = function(){
    console.log("yyyyyyyyyy");
  var userObject = {
      "api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
	    "user_id" : "58fe517c390ea74b3a1e78b3",
	    "privilege" : "gm",
	    "new_user" : {
		      "email" : $scope.userData.email,
		      "privilege" : "gm"
	       }
	};
	console.log(userObject);
	$http({
		method: 'GET',
		url:'/aaibian/admin/list_users',
		data:JSON.stringify(userObject),
		headers: {'Content-Type': 'application/JSON'}
	})
	.then(function(response) {

					console.log(response.data);
					console.log(response.data.valid);
					console.log(response.result);
          //$scope.userList = response.result;
          return response.result;
    });
	}
}
