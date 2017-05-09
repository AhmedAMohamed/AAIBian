// first parameter is th name of the app,
// second parameter is the list of dependecies
var app = angular.module('myApp',["ngRoute",'ngFileUpload']);

 app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider
     .when("/", {
         templateUrl : "/pages/log.html",
         controller : "loginController",
     })
     .when("/add-user", {
        templateUrl : "/pages/addUser.html",
        controller : "addUserController"
     }).when("/list_users", {
       templateUrl : "/pages/viewList.html",
       controller : "getUsersController"
     }).when("/home",{
     	templateUrl : "/pages/home.html",
     	controller: "homeController"
     }).when("/add-news",{
     	templateUrl: "/pages/addNews.html",
     	controller:"addNewsController"
     }).when("/edit_roles",{
     	templateUrl: "/pages/editRoles.html",
     	controller:"editRolesController"
     }).when("/feedback",{
     	templateUrl: "/pages/feedback.html",
     	controller:""
     }).when("/error",{
     	templateUrl: "/pages/error.html",
     	controller:""
     }).otherwise({
        redirectTo: '/error'
      });
     $locationProvider.html5Mode(true);
 }]);
////////////////////////****************************   LOGIN Controller
app.controller('loginController', loginController);
//dependency injection
loginController.$inject=['$scope', '$http', '$window','$location'];
function loginController($scope, $http, $window, $location){
	$scope.loginData = {};
	$scope.login = function(){

	var logObject = {
		'api_key': "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
 		'email': $scope.loginData.email,
 		'password': $scope.loginData.password
	};
	//console.log(logObject);
	$http({
		method: 'POST',
		url:'/aaibian/user/login',
		data:JSON.stringify(logObject),
		headers: {'Content-Type': 'application/json'}
	})
	.then(function(response) {
		console.log(response.data.valid);
		if(response.data.valid){
			$window.sessionStorage.setItem("id", response.data.result.user_id);
			$window.sessionStorage.setItem("logged", "true");
			$window.sessionStorage.setItem("type", response.data.result.privilege);
			$location.path('/home');
            // if(response.data.result.privilege == "gm") {

            // }
            // else {

            // }
		}
		else
		{
			console.log("ERROR");
			$location.path('/error');
		}

    });
	}
}

//////////////////////////*************************** Home Controller
app.controller('homeController', homeController);
//dependency injection
homeController.$inject=['$scope', '$http', '$window', '$location'];
function homeController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.opt = function(num){

			if(num == 0 ){
				$location.path('/feedback');
			}
			else if(num == 1){
				//console.log("hi");
				$location.path('/add-news');
			}
			else if(num == 2){
				$location.path('/add-user');
			}
		}

		$scope.testType = function(){
			if($window.sessionStorage.getItem("type")=="gm"){
				return true;
			}
			else return false;
		}
	}
	else
		$location.path('/error');

}
////////////////////////***************************** Menu Controller
app.controller('menuController', menuController);
//dependency injection
menuController.$inject=['$scope', '$http', '$window', '$location'];
function menuController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){

		$scope.behaviour=function(num){
			if(num == 0 ){
				$location.path('/feedback');
			}
			else if(num == 1){
				console.log("hi");
				$location.path('/add-news');
			}
			else if(num == 2){
				$location.path('/add-user');
			}
			else if (num ==3){
				$window.sessionStorage.clear();
				$location.path('/');
			}
			else if (num ==4){
				$location.path('/list_users');
			}
			else if(num == 5){
				$location.path('/edit_roles');
			}
		}
		$scope.testType = function(){
			if($window.sessionStorage.getItem("type")=="gm"){
				return true;
			}
			else return false;
		}
	}
	else $location.path('/error');
}
///////////////////////////////////////////////////// ***** Edit Roles Controller
app.controller('editRolesController', editRolesController);
//dependency injection
editRolesController.$inject=['$scope', '$http', '$window','$location'];
function editRolesController($scope, $http, $window, $location){
	console.log("entered");
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.roles = [];
		
		$scope.setRoles = function(){
			console.log("here");
			$scope.roles.push({option: "Add News", root: false, admin: false});
			$scope.roles.push({option: "Add Users", root: false, admin: false});
			$scope.roles.push({option: "Show Feedback", root: false, admin: false});
		  	var reqObject = {
		    	"api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};

			
			

			console.log(reqObject);
			// $http({
			// method: 'POST',
			// 	url:'/aaibian/admin/list_users',
			// 	data:JSON.stringify(reqObject),
			// 	headers: {'Content-Type': 'application/JSON'}
			// })
			// .then(function(response) {
			// 	console.log(response.data);
			// 	console.log(response.data.valid);
			// 	console.log(response);
			// 	//console.log("session here");
   //      		$scope.users = response.data.result;
			// 	//console.log($window.sessionStorage.getItem("id"));
			// 	if(response.data.valid){
			// 		return true;

			// 		//$location.path('/new_user');
			// 	}
			// 	else
			// 	{
			// 		return false;
			// 		//$window.location.href='/pages/homeFalse.html';
			// 	}
		 //    });
		}
	}
}
////////////////////////****************************  Add User Controller
app.controller('addUserController', addUserController);
//dependency injection
addUserController.$inject=['$scope', '$http', '$window','$location'];
function addUserController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.userData = {};
		$scope.created = false;
		$scope.resetForm = function(form) {
	      	angular.copy({},form);
	      	$scope.created = false;
    	}

		$scope.addUser = function(){
			console.log("here");
	  	var userObject = {
	      	"api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
		    "user_id" : $window.sessionStorage.getItem("id"),
		    "privilege" : $window.sessionStorage.getItem("type"),
		    "new_user" : {
			      "email" : $scope.userData.email,
			      "name": $scope.userData.name,
			      "password": $scope.userData.password,
			      "privilege" : $scope.userData.type
		       }
		};

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
							$scope.created = true;
							//$location.path('/new_user');
						}
						else
						{
							$scope.created = false;
							$location.path('/error');
						}
	    });
		}
		$scope.getStatus = function(){
			//console.log($scope.created);
			if($scope.created){
				return true;
			}
			else return false;
		}

	}
	else $location.path('/error');
}


///////////////////////////////////////////////////// ***** VIEW USERS
app.controller('getUsersController', getUsersController);
//dependency injection
getUsersController.$inject=['$scope', '$http', '$window','$location'];
function getUsersController($scope, $http, $window, $location){
	console.log("entered");
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.users = [];

		$scope.getUsers = function(){
			console.log("here");
		  	var reqObject = {
		    	"api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};

			$scope.users.push({name: "A", email:"X", type:"Y"});
			$scope.users.push({name: "B", email:"C", type:"D"});
			$scope.users.push({name: "H", email:"I", type:"J"});

			console.log(reqObject);
			// $http({
			// method: 'POST',
			// 	url:'/aaibian/admin/list_users',
			// 	data:JSON.stringify(reqObject),
			// 	headers: {'Content-Type': 'application/JSON'}
			// })
			// .then(function(response) {
			// 	console.log(response.data);
			// 	console.log(response.data.valid);
			// 	console.log(response);
			// 	//console.log("session here");
   //      		$scope.users = response.data.result;
			// 	//console.log($window.sessionStorage.getItem("id"));
			// 	if(response.data.valid){
			// 		return true;

			// 		//$location.path('/new_user');
			// 	}
			// 	else
			// 	{
			// 		return false;
			// 		//$window.location.href='/pages/homeFalse.html';
			// 	}
		 //    });
		 
		}
	}
}
//////////////////////////////////////////////////// ************** Add News Controller + Directive
/*The purpose of using the link option is to capture any changes that 
occur in the file input element. 
Now, how do we get the values? The answer is AngularJS $parse service. 
Usually, a $parse takes an expression and returns a function and our link option,
also, needs a function to return. 
The parsed function onChange will have two parameters. The first parameter is the scope 
and the second will add the files details in $files variable through the event object.*/
//app.directive('ngFiles', ['$parse', function ($parse) {
//
//        function fn_link(scope, element, attrs) {
//            console.log("fn_link");
//            var onChange = $parse(attrs.ngFiles);
//            element.on('change', function (event) {
//                onChange(scope, { $files: event.target.files });
//            });
//        };
//
//        return {
//            link: fn_link
//        }
//} ]);

app.controller('addNewsController', addNewsController);
//dependency injection
addNewsController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addNewsController($scope, $http, $window, $location, Upload){
	// if user is logged in
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.newsData = {};
		$scope.created = false;
		$scope.file ={};
		// function to reset the form
		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}
    	// function to get the files from the form 
    	//var formdata = new FormData();

        //function to add the news, calls the api
        $scope.uploadFile = function(){
			$scope.addNews = function(files){
				if (files && files.length)
				$scope.file = files[0];
			}
            console.log("here");
            console.log($scope.file);
            var newsObject = {
		    	"api_key" : "1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"file" : $scope.file,
				"news" : {
				    "title" : $scope.newsData.title,
				    "Body" : $scope.newsData.body
				}
			};
            Upload.upload({
                url:'/aaibian/admin/add_news',
                method: 'POST',
                data: newsObject,
                headers: {'Content-Type': 'application/JSON'}
              })
            .then(function(response) {
                    if(response.data.valid){
                        $scope.created = true;
                    }
                    else
                    {
                        $scope.created = false;
                        $location.path('/error');
                    }
              });
            console.log("getsFiles");
       // };
		}
		$scope.getStatus = function(){
			console.log($scope.created);
			if($scope.created){
				return true;
			}
			else return false;
		}

	}
	else $location.path('/error');
}
