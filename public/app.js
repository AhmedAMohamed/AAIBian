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
//dependency injection
homeController.$inject=['$scope', '$http', '$window', '$location'];
function homeController($scope, $http, $window, $location){
	if($window.sessionStorage.getItem("logged") == "true"){
		var res=JSON.parse($window.sessionStorage.getItem("functions"));
        $scope.functions = [];
        for (var x in res){
            res.hasOwnProperty(x) && $scope.functions.push(res[x])
        }
        console.log(functions);
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
//dependency injection
getUsersController.$inject=['$scope', '$http', '$window','$location'];
function getUsersController($scope, $http, $window, $location){
	console.log("entered");
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.users = [];

		$scope.getUsers = function(){
			console.log("here");
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

		$scope.getStatus = function() {
            return $scope.created;
		}
	}
}

app.controller('addNewsController', addNewsController);
//dependency injection
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

//////////////////////////////////************************* feedback controller
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
//dependency injection
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
//dependency injection
addBenefitController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addBenefitController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.benefitData = {};
		$scope.created = false;
		$scope.file ={};
		$scope.getZones = function() {
		    $http({
		        method: 'POST',
		        url: 'aaibian/admin/get_areas',
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
		    $http({
		        method: 'POST',
		        url: 'aaibian/admin/get_categories',
                headers: {'Content-Type': 'application/JSON'}
		    })
		    .then(function(response) {
		        if (response.data.valid) {
		            $scope.industries = response.data.results;
		        }
		        else {
		            $scope.industries = [];
		        }
		    })
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
			$scope.uploadFile = function(files){
				if (files && files.length)
				$scope.file = files[0];
			}

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
				    "zone": $scope.benefitData.zone.name,
				    "contacts": [$scope.benefitData.contact1, $scope.benefitData.contact2,
				    $scope.benefitData.contact3],
				    "industry": $scope.benefitData.industry.name,
				    "offer": $scope.benefitData.offer
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
//dependency injection
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
//dependency injection
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
//dependency injection
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
				    "phone" : $scope.medData.phone
				}
			};

			console.log(medObject);

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


//////////////////////////////////////////////////// ************** Add Cardholder benefit Controller
app.controller('addCardholderController', addCardholderController);
//dependency injection
addCardholderController.$inject=['$scope', '$http', '$window','$location', 'Upload'];
function addCardholderController($scope, $http, $window, $location, Upload){
	if($window.sessionStorage.getItem("logged") == "true"){
		$scope.cardData = {};
		$scope.created = false;
		$scope.file ={};

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

		$scope.resetForm = function(form) {
	      	$scope.created = false;
	      	angular.copy({},form);
    	}

    	$scope.fileUploadValue = true;

        $scope.msg = "";

        $scope.addCardholder = function(){

            var cardObject = {
		    	"api_key" : $window.sessionStorage.getItem("api_key"),
				"user_id" : $window.sessionStorage.getItem("id"),
				"privilege" : $window.sessionStorage.getItem("type"),
				"new_cardholder" : {
				    "name" : $scope.cardData.name,
				    "offer" : $scope.cardData.offer,
				    "type" : $scope.cardData.type
				}
			};

            $http({
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
