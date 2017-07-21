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
     	controller:"feedbackController"
     }).when("/error",{
     	templateUrl: "/pages/error.html",
     	controller:""
     }).when("/add_atm", {
        templateUrl : "/pages/addATM.html",
        controller : "addATMController"
     }).when("/add_staff_benefits", {
        templateUrl : "/pages/addBenefit.html",
        controller : "addBenefitController"
     }).when("/add_area", {
        templateUrl : "/pages/addArea.html",
        controller : "addAreaController"
     }).when("/add_category", {
        templateUrl : "/pages/addCategory.html",
        controller : "addCategoryController"
     }).when("/add_medical", {
        templateUrl : "/pages/addMedical.html",
        controller : "addMedicalController"
     }).when("/add_cardholder", {
        templateUrl : "/pages/addCardholder.html",
        controller : "addCardholderController"
     }).when("/list_news", {
        templateUrl : "/pages/listNews.html",
        controller : "showNewsController"
     }).when("/edit_news", {
        templateUrl : "/pages/editNews.html",
        controller : "editNewsController"
     }).when("/edit_user", {
        templateUrl : "/pages/editUser.html",
        controller : "editUserController"
     }).when("/list_atms", {
        templateUrl : "/pages/listATM.html",
        controller : "showATMController"
     }).when('/list_areas', {
        templateUrl : "/pages/listArea.html",
        controller : "showAreaController"
     }).when('/list_categories', {
        templateUrl : "/pages/listCategory.html",
        controller : "showCategoryController"
     }).when('/edit_area', {
        templateUrl : '/pages/editArea.html',
        controller : 'editAreaController'
     }).when('/edit_category', {
        templateUrl : '/pages/editCategory.html',
        controller : 'editCategoryController'
     }).otherwise({
        redirectTo: '/error'
     });
     $locationProvider.html5Mode(true);
 }]);

////////////////////////****************************   LOGIN Controller
app.controller('loginController', loginController);
loginController.$inject=['$scope', '$http', '$window','$location'];
function loginController($scope, $http, $window, $location){
	$scope.loginData = {};
	$scope.loggedIn = false;

	$scope.resetForm = function(form) {
    	      	angular.copy({},form);
    	      	$scope.created = false;
        	}

	$scope.login = function(){
	var logObject = {
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
			$window.sessionStorage.setItem("api_key", response.data.result.api_key);
			$window.sessionStorage.setItem("logged", "true");
			$window.sessionStorage.setItem("type", response.data.result.privilege);
			$http({
				method: 'GET',
				url:'/aaibian/admin/get_privilege/' + $window.sessionStorage.getItem("type"),
				data:JSON.stringify(logObject),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(response.data.valid){
					$window.sessionStorage.setItem("functions", JSON.stringify(res.data.functions));
					console.log($window.sessionStorage.getItem("functions"));
					$location.path('/home');
				}
				else {
				    $location.path('/error');
				}
			});
		}
		else
		{
			console.log("ERROR");
			$scope.resetForm($scope.loginData);
            $scope.loggedIn = true;
		}

    });
	}
}

//////////////////////////*************************** Home Controller
app.controller('homeController', homeController);
homeController.$inject=['$scope', '$http', '$window', '$location'];
function homeController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		var res=JSON.parse($window.sessionStorage.getItem("functions"));
        $scope.functions = [];
        for (var x in res){
            res.hasOwnProperty(x) && $scope.functions.push(res[x])
        }
        console.log($scope.functions);
		$scope.opt = function(val){
			console.log(val);
			if(val == "Show Feedback"){
                $location.path('/feedback');
            }
            else if(val == "Add News"){
                console.log("hi");
                $location.path('/add-news');
            }
            else if(val == "Add Users"){
                console.log("Ahmed Alaa Mohamed");
                $location.path('/add-user');
            }
            else if(val == "Edit Roles"){
                $location.path('/edit_roles');
            }
            else if(val == "Add Category"){
                $location.path('/add_category');
            }
            else if(val == "Add Staff Benefits"){
                $location.path('/add_staff_benefits');
            }
            else if(val == "Add Medical Benefits"){
                $location.path('/add_medical');
            }
            else if(val == "Add ATM"){
                $location.path('/add_atm');
            }
            else if(val == 'Add Cardholders Benefits'){
                $location.path('/add_cardholder');
            }
            else if(val == 'Add  Area'){
                $location.path('/add_area');
            }
            else if(val == 'Change Staff Password'){
                $location.path('/change_staff_password');
            }
            else if(val == 'Add Area'){
                $location.path('/add_area');
            }
            else if(val == 'Show News') {
                $location.path('/list_news');
            }
            else if(val == 'Show ATMs') {
                $location.path('/list_atms');
            }
            else if (val == 'Show Areas') {
                $location.path('/list_areas');
            }
            else if (val == "Show Users"){
                $location.path('/list_users');
            }
            else if (val == 'Show Categories') {
                $location.path('/list_categories');
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
menuController.$inject=['$scope', '$http', '$window', '$location'];
function menuController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		var res=JSON.parse($window.sessionStorage.getItem("functions"));
		$scope.functions = [];
		for (var x in res){
		   	res.hasOwnProperty(x) && $scope.functions.push(res[x])
		}
		$scope.behaviour=function(val){
			if(val == "Show Feedback"){
				$location.path('/feedback');
			}
			else if(val == "Add News"){
				console.log("hi");
				$location.path('/add-news');
			}
			else if(val == "Add Users"){
				$location.path('/add-user');
			}
			else if (val == 3){
				$window.sessionStorage.clear();
				$location.path('/');
			}
			else if (val == "Show Users"){
				$location.path('/list_users');
			}
			else if(val == "Edit Roles"){
				$location.path('/edit_roles');
			}
			else if(val == "Add Category"){
				$location.path('/add_category');
			}
			else if(val == "Add Staff Benefits"){
				$location.path('/add_staff_benefits');
			}
			else if(val == "Add Medical Benefits"){
				$location.path('/add_medical');
			}
			else if(val == "Add ATM"){
				$location.path('/add_atm');
			}
			else if(val == 'Add Cardholders Benefits'){
				$location.path('/add_cardholder');
			}
			else if(val == 'Add  Area'){
				$location.path('/add_area');
			}
			else if(val == 'Change Staff Password'){
				$location.path('/change_staff_password');
			}
			else if(val == 'Add Area'){
                $location.path('/add_area');
            }
            else if(val == 'Show News') {
                $location.path('/list_news');
            }
            else if(val == 'Show ATMs') {
                $location.path('/list_atms');
            }
            else if (val == 'Show Areas') {
                $location.path('/list_areas');
            }
            else if (val == 'Show Categories') {
                $location.path('/list_categories');
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
editRolesController.$inject=['$scope', '$http', '$window','$location'];
function editRolesController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.getRoles = function(role) {
		    console.log("get the privileges");
		    $http({
		        method: 'GET',
		        url: 'aaibian/admin/get_privilege/' + role,
		        headers: {'Content-Type': 'application/json'}

		    }).then(function(response) {
		        console.log("called to get role");
                console.log(role);
                console.log("he asked for that role");

		        if (response.data.valid) {
                    if (role == "admin") {
                        $scope.admin_role = response.data.functions;
                        console.log("that was the admin roles");
                        console.log($scope.admin_role);
		            }
		            else if (role == 'root') {
                        $scope.root_role = response.data.functions;
                        console.log("that was the root roles");
                        console.log($scope.root_role);
		            }

		            $scope.getCheckedValue = function(option, role) {
                        console.log("in view the checked");
                        if (role == "admin") {
                            for(var val in $scope.admin_role) {
                                console.log("in loop admin");
                                console.log($scope.admin_role[val]);
                                console.log(option);
                                console.log("that was one check");
                                if(option == $scope.admin_role[val]) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        else if (role == 'root') {
                            for (var val in $scope.root_role) {
                                console.log("in loop for the root");
                                console.log($scope.root_role[val]);
                                console.log(option);
                                console.log("that was two check");
                                if (option == $scope.root_role[val]) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    };

		        }
		        else {
		            return [];
		        }
		    })
		};
        $scope.getRoles('admin');
        $scope.getRoles('root');
		$scope.options = ["Add Users", "Add Category","Add Staff Benefits","Add News",
		"Add Medical Benefits","Add ATM","Add Cardholders Benefits","Add Area","Change Staff Password","Show Feedback"];
		$scope.root_privilege = [];
		$scope.admin_privilege = [];


		$scope.setRoles = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type"),
			    "request": {
				        "root_privilege": Object.keys($scope.root_privilege),
				        "admin_privilege":Object.keys($scope.admin_privilege)
				    }
			};
			$http({
			method: 'POST',
				url:'/aaibian/admin/set_privilege',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				console.log(response.data);
				console.log(response.data.valid);
				console.log(response);
				//console.log("session here");
        		//$scope.users = response.data.result;
				//console.log($window.sessionStorage.getItem("id"));
				if(response.data.valid){
					return true;

					//$location.path('/new_user');
				}
				else
				{
					return false;
					//$window.location.href='/pages/homeFalse.html';
				}
		    });
		}
	}
}

////////////////////////****************************  Add User Controller
app.controller('addUserController', addUserController);
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
	      	"api_key" : $window.sessionStorage.getItem("api_key"),
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
getUsersController.$inject=['$scope', '$http', '$window','$location'];
function getUsersController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.users = [];

		$scope.getUsers = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};

			$http({
			method: 'POST',
				url:'/aaibian/admin/list_users',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				console.log(response.data);
				console.log(response.data.valid);
				console.log(response);
        		$scope.users = response.data.result;
				if(response.data.valid){
					return true;
				}
				else
				{
					return false;
				}
		    });

		}

		$scope.deleteUser = function(id) {
		    var request = {
		        "to_delete_id": id
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/delete_user',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "User deleted";
                    console.log("here before update");
                    $scope.getUsers();
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "User not deleted yet";
		        }
		    });
		}

        $scope.editUser = function (id) {
            $location.path('/edit_user/').search({"id" : id});
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

///////////////////////////////////////////////////// ***** ADD NEWS
app.controller('addNewsController', addNewsController);
addNewsController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addNewsController($scope, $http, $window, $location, Upload){
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
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
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

//////////////////////////////////************************* VIEW FEEDBACK
app.controller('feedbackController', feedbackController);
feedbackController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function feedbackController($scope, $http, $window,$location, Upload) {
    if($window.sessionStorage.getItem("logged") == "true"){
        $scope.feedbacks = [];
        $scope.getFeedbacks = function() {
            var reqObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type")
            };
            $http({
                method: 'POST',
                url: '/aaibian/admin/show_feedbacks',
                data: JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid) {
                    console.log(response.data.result);
                    $scope.feedbacks = response.data.result;
                    return true;
                }
                else {
                    return false;
                }
            });
        }

        $scope.deleteFeedBack = function(id) {
            var request = {
                "to_delete_id": id
            };
            $http({
                method: 'POST',
                url: '/aaibian/admin/delete_feedback',
                data: JSON.stringify(request),
                headers: {'Content-Type' : 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "User deleted";
                    console.log("here before update");
                    $scope.getFeedbacks();
                }
                else {
                    $scope.created = false;
                    $scope.msg = "User not deleted yet";
                }
            });
        };
    }
    else {
        $location.path('/error');
    }
}

////////////////////////****************************  Add ATM Controller
app.controller('addATMController', addATMController);
addATMController.$inject=['$scope', '$http', '$window','$location'];
function addATMController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.ATMData = {};
		$scope.created = false;
		$scope.zones = [];
		$scope.industries = [];
		$scope.resetForm = function(form) {
	      	angular.copy({},form);
	      	$scope.created = false;
    	}

    	$scope.getZone = function() {
    	    console.log("here in areas");
            var reqObject = {
                "sector": 'atm'
            };
            $http({
                method: 'POST',
                url: '/aaibian/admin/get_areas',
                data: JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid) {
                    console.log(response.data.results);
                    $scope.areas = response.data.results;
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        $scope.getCategories = function() {
            var reqObject = {
                "sector": 'atm'
            };
            $http({
                method: 'POST',
                url: '/aaibian/admin/get_categories',
                data: JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid) {
                    console.log(response.data.results);
                    $scope.cities = response.data.results;
                    return true;
                }
                else {
                    return false;
                }
            });
        }


        $scope.getZone();
        $scope.getCategories();

		$scope.addATM = function(){
            var atmObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "new_atm" : {
                      "loc_name" : $scope.ATMData.loc_name.name,
                      "address": $scope.ATMData.address,
                      "location": {
                            "lat": $scope.ATMData.lat,
                            "lng": $scope.ATMData.lng
                        },
                        "id": new Date(Date.now()).getTime(),
                        "city": $scope.ATMData.city.name
                    }
                };
            $http({
                method: 'POST',
                url:'/aaibian/admin/add_atm',
                data:JSON.stringify(atmObject),
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

//////////////////////////////////////////////////// ************** Add Benefit Controller
app.controller('addBenefitController', addBenefitController);
addBenefitController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addBenefitController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.benefitData = {};
		$scope.created = false;
		$scope.file ={};
        $scope.minDate = new Date(Date.now());
		$scope.getZones = function() {
            var reqObject = {
                "sector" : "ben"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_areas',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.zones = response.data.results;
                }
                else {
                    $scope.zones = [];
                }
            });
        };
        $scope.getCategories = function() {

            var reqObject = {
                "sector" : "ben"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_categories',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.industries = response.data.results;
                }
                else {
                    $scope.industries = [];
                }
            });
        };

        $scope.getZones();
        $scope.getCategories();

		// function to reset the form
		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}
    	$scope.fileUploadValue = true;
    	// function to get the files from the form
    	//var formdata = new FormData();
        $scope.msg = "";
        //function to add the news, calls the api
        $scope.addBenefit = function(){
			console.log($scope.benefitData.delete_date);

			$scope.uploadFile = function(files){
				if (files && files.length)
				$scope.file = files[0];
			}

			console.log(JSON.stringify($scope.benefitData))

            var benefitObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"file" : $scope.file,
				"new_benefit" : {
				    "name" : $scope.benefitData.name,
				    "address" : $scope.benefitData.address,
				    "location" : {
				    	"lat": $scope.benefitData.lat,
			      		"lng": $scope.benefitData.lng
				    },
				    "zone": typeof $scope.benefitData.zone != 'undefined' ? $scope.benefitData.zone.name : "other",
				    "contacts": [$scope.benefitData.contact1, $scope.benefitData.contact2,
				        $scope.benefitData.contact3],
				    "industry": typeof $scope.benefitData.industry != 'undefined' ? $scope.benefitData.industry.name : "other",
				    "offer": $scope.benefitData.offer,
				    "delete_date": $scope.benefitData.delete_date
				}
			};

            Upload.upload({
                url:'/aaibian/admin/add_benefit',
                method: 'POST',
                data: benefitObject,
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
        };
		$scope.getStatus = function(){
			if($scope.created){
				$scope.message = "Benefit Added Successfully"
				return true;
			}
			else {
                $scope.message = "Benefit not added correctly try again"
                return false;
			}
		}

	}
	else $location.path('/error');
}

//////////////////////////////////////////////////// ************** Add Area Controller
app.controller('addAreaController', addAreaController);
addAreaController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addAreaController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		console.log("hi");
		$scope.areaData = {};
		$scope.sectors=["Cardholder's Benefits", "Staff Benefits", "Medical Benefits", "ATMs"];
		$scope.created = false;
		$scope.file ={};
		// function to reset the form
		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}

        $scope.addArea = function(){

            console.log("here");
            $scope.sector = "";
            if($scope.areaData.sector == "Cardholder's Benefits"){
                $scope.sector = "card";
            }
            else if ($scope.areaData.sector == "Staff Benefits"){
                $scope.sector = "ben";
            }
            else if ($scope.areaData.sector == "Medical Benefits"){
                $scope.sector = "med";
            }
            else if ($scope.areaData.sector == "ATMs"){
                            $scope.sector = "atm";
                        }
            var areaObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"new_area" : {
				    "name" : $scope.areaData.name,
				    "sector" : $scope.sector,
				}
			};
			$http({
                method: 'POST',
                url: '/aaibian/admin/add_area',
                data: JSON.stringify(areaObject),
                headers: {'Content-Type': 'application/JSON'}
             })
            .then(function(response) {
                if(response.data.valid) {
                    console.log(response.data.result);
                    $scope.created = true;
                    return true;
                }
                else {
                    return false;
                }
            });

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

//////////////////////////////////////////////////// ************** Add Category Controller
app.controller('addCategoryController', addCategoryController);
addCategoryController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addCategoryController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.categoryData = {};
		$scope.created = false;
		$scope.file ={};

		$scope.getSectors = function() {
		    var sectors = [
		        {
		            "key": "atm",
		            "value": "ATMs"
		        },
		        {
                    "key": "ben",
                    "value": "Staff Benefits"
                },
                {
                    "key": "med",
                    "value": "Medical Benefits"
                },
                {
                    "key": "card",
                    "value": "Cardholder's Benefits"
                }
		    ];

		    $scope.sectors = sectors;
		};
        $scope.getSectors();
		// function to reset the form
		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}
    	$scope.fileUploadValue = true;
    	// function to get the files from the form
    	//var formdata = new FormData();
        $scope.msg = "";
        //function to add the news, calls the api
        $scope.addCategory = function(){
			$scope.uploadFile = function(files){
				if (files && files.length)
				$scope.file = files[0];
			}

            var categoryObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"file" : $scope.file,
				"new_category" : {
				    "name" : $scope.categoryData.name,
				    "sector" : $scope.categoryData.sector.key,
				}
			};
            Upload.upload({
                url:'/aaibian/admin/add_category',
                method: 'POST',
                data: categoryObject,
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
        };

		$scope.getStatus = function(){
			if($scope.created){
				$scope.message = "Category Added Successfully"
				return true;
			}
			else {
                $scope.message = "Category not added correctly try again"
                return false;
			}
		}

	}
	else $location.path('/error');
}

//////////////////////////////////////////////////// ************** Add Medical benefit Controller
app.controller('addMedicalController', addMedicalController);
addMedicalController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addMedicalController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.medData = {};
		$scope.created = false;
		$scope.file ={};

		$scope.getZones = function() {
            var reqObject = {
                "sector" : "med"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_areas',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.zones = response.data.results;
                }
                else {
                    $scope.zones = [];
                }
            });
        };
        $scope.getCategories = function() {
            var reqObject = {
                "sector" : "med"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_categories',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.types = response.data.results;
                }
                else {
                    $scope.types = [];
                }
            });
        };

        $scope.getZones();
        $scope.getCategories();

		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}

    	$scope.fileUploadValue = true;

        $scope.msg = "";

        $scope.addMedical = function(){
			$scope.uploadFile = function(files){
				if (files && files.length)
				$scope.file = files[0];
			}

            var medObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"file" : $scope.file,
				"new_medical" : {
				    "name" : $scope.medData.name,
				    "address" : $scope.medData.address,
				    "location" : {
                            "lat" : $scope.medData.location.lat,
                            "lng" : $scope.medData.location.lng
				    },
				    "zone" : $scope.medData.zone,
				    "type" : $scope.medData.type,
				    "phone_numbers": [$scope.medData.contact1, $scope.medData.contact2,
                    				        $scope.medData.contact3],
                    "offer": $scope.medData.offer,
                    "delete_date": $scope.medData.delete_date
				}
			};

			console.log(JSON.stringify(medObject));

            Upload.upload({
                url:'/aaibian/admin/add_medical',
                method: 'POST',
                data: medObject,
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
        };

		$scope.getStatus = function(){
			if($scope.created){
				$scope.message = "Medical Benefit  Added Successfully"
				return true;
			}
			else {
                $scope.message = "Medical Benefit not added correctly try again"
                return false;
			}
		}

	}
	else $location.path('/error');
}

//////////////////////////////////////////////////// ************** Add Cardholder benefit Controller
app.controller('addCardholderController', addCardholderController);
addCardholderController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addCardholderController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.cardData = {};
		$scope.created = false;
		$scope.file ={};
		$scope.zones = [];

        $scope.getZones = function() {
            var reqObject = {
                "sector" : "card"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_areas',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.zones = response.data.results;
                    console.log(response.data.results);
                    console.log("Printed results");
                }
                else {
                    $scope.zones = [];
                }
            });
        };

		$scope.getCategories = function() {
            var reqObject = {
                "sector" : "card"
            };
            $http({
                method: 'POST',
                url: 'aaibian/admin/get_categories',
                data: reqObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if (response.data.valid) {
                    $scope.types = response.data.results;
                }
                else {
                    $scope.types = [];
                }
            });
        };

        $scope.getCategories();
        $scope.getZones();

		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}

    	$scope.fileUploadValue = true;

        $scope.msg = "";

        $scope.addCardholder = function(){
            $scope.uploadFile = function(files){
                if (files && files.length)
                    $scope.file = files[0];
            }
            console.log($scope.file);
            var cardObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"file" : $scope.file,
				"new_cardholder" : {
				    "name" : $scope.cardData.name,
				    "offer" : $scope.cardData.offer,
				    "type" : typeof $scope.cardData.type != 'undefiled' ?  $scope.cardData.type.name : "other",
				    "location" : {
                        "lat": $scope.cardData.lat,
                        "lng": $scope.cardData.lng
                    },
                    "address": $scope.cardData.address,
                    "zone": typeof $scope.cardData.zone != 'undefined' ? $scope.cardData.zone.name : "other",
                    "contacts": [$scope.cardData.contact1, $scope.cardData.contact2,
                        $scope.cardData.contact3],
                    "delete_date": $scope.cardData.delete_date,
				}
			};
            Upload.upload({
                url:'/aaibian/admin/add_cardholder',
                method: 'POST',
                data: cardObject,
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
        };

		$scope.getStatus = function(){
			if($scope.created){
				$scope.message = "Cardholder benefit Added Successfully"
				return true;
			}
			else {
                $scope.message = "Cardholder benefit not added correctly try again"
                return false;
			}
		}

	}
	else $location.path('/error');
}

//////////////////////////////////////////////////// ************** Show News Controller
app.controller('showNewsController', showNewsController);
showNewsController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function showNewsController($scope, $http, $window, $location, Upload){

    if($window.sessionStorage.getItem("logged") == "true"){

		$scope.getNews = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'POST',
				url:'/aaibian/admin/show_news',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
        		$scope.news = response.data.result;
				if(response.data.valid){
					return true;
				}
				else
				{
					return false;
				}
		    });

		}

        $scope.attachmentShow = function(news) {
            if (news.media_path == "" || typeof news.media_path == 'undefined') {
                return false;
            }
            else {
                return true;
            }
        };

		$scope.deleteNews = function(id) {
		    var request = {
		        "to_delete_id": id
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/delete_news',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        console.log("in delete");
		        console.log(response.data);
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "News deleted";
                    $scope.getNews();
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "News not deleted yet";
		        }
		    });
		}

        $scope.editNews = function(id) {
            $location.path('/edit_news/').search({"id" : id});
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}


//////////////////////////////////////////////////// ************** Show ATM Controller
app.controller('showATMController', showATMController);
showATMController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function showATMController($scope, $http, $window, $location, Upload){

    if($window.sessionStorage.getItem("logged") == "true"){

		$scope.getATMs = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'POST',
				url:'/aaibian/admin/show_atms',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
        		$scope.ATMs = response.data.result;
				if(response.data.valid){
					return true;
				}
				else
				{
					return false;
				}
		    });

		}


		$scope.deleteATM = function(id) {
		    var request = {
		        "to_delete_id": id
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/delete_atm',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        console.log(response.data);
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "ATM deleted";
                    $scope.getATMs();
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "ATM not deleted yet";
		        }
		    });
		}

        $scope.editNews = function(id) {
        //    $location.path('/edit_atm/').search({"id" : id});
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

//////////////////////////////////////////////////// ************** Show Area Controller
app.controller('showAreaController', showAreaController);
showAreaController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function showAreaController($scope, $http, $window, $location, Upload){

    if($window.sessionStorage.getItem("logged") == "true"){

		$scope.getAreas = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'POST',
				url:'/aaibian/admin/show_areas',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
        		$scope.areas = response.data.result;
				if(response.data.valid){
					return true;
				}
				else
				{
					return false;
				}
		    });

		}

		$scope.getSectorVal = function(val) {
		    if (val == 'ben') {
		        return "Staff Benefits";
		    }
		    else if (val == 'atm') {
		        return "ATMs";
		    }
		    else if (val == 'card') {
		        return "Cardholder's Benefits";
		    }
		    else if (val == 'med') {
		        return "Medical Benefits";
		    }
		}


		$scope.deleteArea = function(id) {
		    var request = {
		        "to_delete_id": id
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/delete_area',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        console.log(response.data);
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "Area deleted";
                    $scope.getAreas();
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "Area not deleted yet";
		        }
		    });
		}

        $scope.editArea = function(id) {
            $location.path('/edit_area/').search({"id" : id});
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

//////////////////////////////////////////////////// ************** Show Category Controller
app.controller('showCategoryController', showCategoryController);
showCategoryController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function showCategoryController($scope, $http, $window, $location, Upload){

    if($window.sessionStorage.getItem("logged") == "true"){

		$scope.getCategories = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'POST',
				url:'/aaibian/admin/show_categories',
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
        		$scope.cats = response.data.result;
				if(response.data.valid){
					return true;
				}
				else
				{
					return false;
				}
		    });

		}

		$scope.getSectorVal = function(val) {
		    if (val == 'ben') {
		        return "Staff Benefits";
		    }
		    else if (val == 'atm') {
		        return "ATMs";
		    }
		    else if (val == 'card') {
		        return "Cardholder's Benefits";
		    }
		    else if (val == 'med') {
		        return "Medical Benefits";
		    }
		}


		$scope.deleteCategory = function(id) {
		    var request = {
		        "to_delete_id": id
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/delete_category',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        console.log(response.data);
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "Area deleted";
                    $scope.getCategories();
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "Area not deleted yet";
		        }
		    });
		}

        $scope.editCategory = function(id) {
            $location.path('/edit_category/').search({"id" : id});
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

//////////////////////////////////////////////////// ************** Edit News Controller
app.controller('editNewsController', editNewsController);
editNewsController.$inject=['$scope', '$http', '$window','$location','$routeParams' , 'Upload'];
function editNewsController($scope, $http, $window, $location, $routeParams, Upload){

    $scope.news_id = $location.search().id;
    $scope.showEdit = false;
    $scope.showRemove = false;
    $scope.newsData = {};
    $scope.news = {};
    $scope.removed = false;
    $scope.uploadDivView = false;
    $scope.mediaUploaded = false;
    $scope.uploadLogoDivView = false;


    if($window.sessionStorage.getItem("logged") == "true"){
		$scope.getNewsDate = function(){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'GET',
				url:'/aaibian/admin/get_newsData/' + $scope.news_id,
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				if(response.data.valid){
				    $scope.news = response.data.result;
					return true;
				}
				else
				{
					return false;
				}
		    });
		}

        $scope.editNews = function() {
            var reqObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "news_data" : {
                    "title" : $scope.newsData.title == null ? $scope.news.title : $scope.newsData.title,
                    "Body" : $scope.newsData.body == null ? $scope.news.Body : $scope.newsData.body
                }
            };
            $http({
            method: 'POST',
                url:'/aaibian/admin/edit_news/' + $scope.news_id,
                data:JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $location.path('/list_news');
                    return true;
                }
                else
                {
                    $location.path("/error");
                    return false;
                }
            });
        }

        $scope.uploadMedia = function() {

            return !$scope.removed;
        }

        $scope.showAttachment = function() {
            if ($scope.removed || $scope.news.media_path == "") {
                return false;
            }
            else {
                return true;
            }
        }

        $scope.uploadMediaFile = function() {
            console.log("here in upload media file");
            $scope.uploadDivView = true;
        }

        $scope.showUploadMedia = function() {
            if ($scope.removed || $scope.news.media_path == "") {
                return true;
            }
            else {
                return false;
            }
        }

		$scope.removeMedia = function(id) {
		    var request = {
		        "to_delete_id": id,
		        "model" : "news"
		    };
		    $http({
		        method: 'POST',
		        url: '/aaibian/admin/remove_media',
		        data: JSON.stringify(request),
		        headers: {'Content-Type' : 'application/JSON'}
		    })
		    .then(function(response) {
		        if (response.data.valid) {
                    $scope.created = true;
                    $scope.msg = "Media deleted";
                    $scope.removed = true;
		        }
		        else {
                    $scope.created = false;
                    $scope.msg = "Media not deleted yet";
		        }
		    });
		}

        $scope.addMedia = function(){
            $scope.uploadFile = function(files){
                if (files && files.length)
                $scope.file = files[0];
            }
            var benefitObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "file" : $scope.file,
                "request" : {
                    "model" : "news"
                }
            };
            Upload.upload({
                url:'/aaibian/admin/upload_media/' + $scope.news_id,
                method: 'POST',
                data: benefitObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $scope.mediaUploaded = true;
                    $location.path('list_news');
                }
                else {
                    $scope.mediaUploaded = false;
                }
            });
        }

        $scope.editLogo = function(id) {
            $scope.uploadLogoDivView = true;
            console.log("edit logo");
        }

        $scope.addLogo = function(){
            $scope.uploadFile = function(files){
                if (files && files.length)
                $scope.file = files[0];
            }
            var benefitObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "file" : $scope.file2,
                "request" : {
                    "model" : "news"
                }
            };
            Upload.upload({
                url:'/aaibian/admin/upload_logo/' + $scope.news_id,
                method: 'POST',
                data: benefitObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $scope.logoUploaded = true;
                    $location.path('/list_news');
                }
                else {
                    $scope.logoUploaded = false;
                }
            });
        }

        $scope.editMedia = function(id) {
            $scope.uploadDivView = true;
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

//////////////////////////////////////////////////// ************** Edit User Controller
app.controller('editUserController', editUserController);
editUserController.$inject=['$scope', '$http', '$window','$location','$routeParams' , 'Upload'];
function editUserController($scope, $http, $window, $location, $routeParams, Upload){

    $scope.user_id = $location.search().id;
    $scope.showEdit = false;
    $scope.showRemove = false;
    $scope.userData = {};
    $scope.user = {};
    $scope.removed = false;
    $scope.uploadDivView = false;
    $scope.mediaUploaded = false;
    $scope.uploadLogoDivView = false;
    $scope.showPasswordDiv = false;
    $scope.showPasswordMsg = "Show Password";

    console.log("HREHREHRJER");


    if($window.sessionStorage.getItem("logged") == "true"){
		$scope.getUserDate = function(id){
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'GET',
				url:'/aaibian/admin/get_userData/' + $scope.user_id,
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				if(response.data.valid){
				    $scope.user = response.data.result;
					return true;
				}
				else
				{
					return false;
				}
		    });
		}

        $scope.editUser = function() {
            var reqObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "user_data" : {
                    "name" : $scope.userData.name == null ? $scope.user.name : $scope.userData.name,
                    "email" : $scope.userData.email == null ? $scope.user.email : $scope.userData.email,
                    "password" : $scope.userData.password == null ? $scope.user.password : $scope.userData.password
                }
            };

            console.log(reqObject);
            $http({
            method: 'POST',
                url:'/aaibian/admin/edit_user/' + $scope.user_id,
                data:JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $location.path('/list_users');
                    return true;
                }
                else
                {
                    $location.path("/error");
                    return false;
                }
            });
        }

        $scope.showPasswordDivUpdate = function() {
            $scope.showPasswordMsg = "Hide Password";
            $scope.showPasswordDiv = ! $scope.showPasswordDiv;
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
	else {
	    console.log("Not valid");
	}
}

//////////////////////////////////////////////////// ************** Edit Area Controller
app.controller('editAreaController', editAreaController);
editUserController.$inject=['$scope', '$http', '$window','$location','$routeParams' , 'Upload'];
function editAreaController($scope, $http, $window, $location, $routeParams, Upload){

    $scope.area_id = $location.search().id;
    $scope.showEdit = false;
    $scope.showRemove = false;
    $scope.areaData = {};
    $scope.area = {};
    $scope.sectors = [];


    if($window.sessionStorage.getItem("logged") == "true"){
		$scope.getAreaData = function(id){

		  	$scope.getSectors();

		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'GET',
				url:'/aaibian/admin/get_areaData/' + $scope.area_id,
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				if(response.data.valid){
				    $scope.area = response.data.result;
				    $scope.selected = $scope.sectors.filter(function(item) {
                        console.log(item)
                        $scope.area.sector
                        if(item.key == $scope.area.sector) {
                            return item;
                        }
                    });
                    $scope.areaData.sector = $scope.selected[0];
                    return true;
				}
				else {
					return false;
				}
		    });
		}
        $scope.getSectors = function() {
            var sectors = [
                {
                    "key": "atm",
                    "value": "ATMs"
                },
                {
                    "key": "ben",
                    "value": "Staff Benefits"
                },
                {
                    "key": "med",
                    "value": "Medical Benefits"
                },
                {
                    "key": "card",
                    "value": "Cardholder's Benefits"
                }
            ];
            $scope.sectors = sectors;
        };

        $scope.editArea = function() {
            var reqObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "area_data" : {
                    "name" : $scope.areaData.name == null ? $scope.area.name : $scope.areaData.name,
                    "sector" : $scope.areaData.sector != 'undefined' ? $scope.areaData.sector.key : $scope.area.sector
                }
            };


            $http({
            method: 'POST',
                url:'/aaibian/admin/edit_area/' + $scope.area_id,
                data:JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $location.path('/list_areas');
                    return true;
                }
                else
                {
                    $location.path("/error");
                    return false;
                }
            });
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

//////////////////////////////////////////////////// ************** Edit Category Controller
app.controller('editCategoryController', editCategoryController);
editCategoryController.$inject=['$scope', '$http', '$window','$location','$routeParams' , 'Upload'];
function editCategoryController($scope, $http, $window, $location, $routeParams, Upload){

    $scope.category_id = $location.search().id;
    $scope.showEdit = false;
    $scope.showRemove = false;
    $scope.areaData = {};
    $scope.category = {};
    $scope.sectors = [];
    $scope.uploadLogoDivView = false;

    if($window.sessionStorage.getItem("logged") == "true"){
		$scope.getCategoryData = function(id){
		  	$scope.getSectors();
		  	var reqObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
			    "user_id" : $window.sessionStorage.getItem("id"),
			    "privilege" : $window.sessionStorage.getItem("type")
			};
			$http({
			method: 'GET',
				url:'/aaibian/admin/get_categoryData/' + $scope.category_id,
				data:JSON.stringify(reqObject),
				headers: {'Content-Type': 'application/JSON'}
			})
			.then(function(response) {
				if(response.data.valid){
				    $scope.category = response.data.result;
				    $scope.selected = $scope.sectors.filter(function(item) {
                        if(item.key == $scope.category.sector) {
                            return item;
                        }
                    });
                    $scope.categoryData.sector = $scope.selected[0];
                    return true;
				}
				else {
					return false;
				}
		    });
		}
        $scope.getSectors = function() {
            var sectors = [
                {
                    "key": "atm",
                    "value": "ATMs"
                },
                {
                    "key": "ben",
                    "value": "Staff Benefits"
                },
                {
                    "key": "med",
                    "value": "Medical Benefits"
                },
                {
                    "key": "card",
                    "value": "Cardholder's Benefits"
                }
            ];
            $scope.sectors = sectors;
        }

        $scope.editLogo = function() {
            $scope.uploadLogoDivView = true;
        }

        $scope.addLogo = function(){
            $scope.uploadFile = function(files){
                if (files && files.length)
                $scope.file = files[0];
            }
            var categoryObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "file" : $scope.file2,
                "request" : {
                    "model" : "category"
                }
            };
            Upload.upload({
                url:'/aaibian/admin/upload_logo/' + $scope.category_id,
                method: 'POST',
                data: categoryObject,
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                console.log("here");
                console.log(response);
                if(response.data.valid){
                    $scope.logoUploaded = true;
                    console.log("here in valid");
                    $location.path('/list_category');

                }
                else {
                    $scope.logoUploaded = false;
                }
            });
        }

        $scope.editCategory = function() {

            var reqObject = {
                "api_key" : $window.sessionStorage.getItem("api_key"),
                "user_id" : $window.sessionStorage.getItem("id"),
                "privilege" : $window.sessionStorage.getItem("type"),
                "category_data" : {
                    "name" : $scope.categoryData.name == null ? $scope.category.name : $scope.categoryData.name,
                    "sector" : $scope.categoryData.sector != 'undefined' ? $scope.categoryData.sector.key : $scope.category.sector
                }
            };


            $http({
            method: 'POST',
                url:'/aaibian/admin/edit_category/' + $scope.category_id,
                data:JSON.stringify(reqObject),
                headers: {'Content-Type': 'application/JSON'}
            })
            .then(function(response) {
                if(response.data.valid){
                    $location.path('/list_categories');
                    return true;
                }
                else
                {
                    $location.path("/error");
                    return false;
                }
            });
        }

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}