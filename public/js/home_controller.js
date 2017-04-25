

function login_button_activate() {

  $( "#header" ).load( "/logging_panel.html");
  //$.ajax('home', {
  //  type: 'post',
  //  data: $.param({ "ahmed": "good" }),
  //  success: function(data) {
      //document.location = "/trial_data";
      //document.getElementById("header").innerHTML = "<h1>AHmed ALAAAAAA</h1>";

  //   }
  //});
}


function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  console.log("DODODOSDOISHFOHDFSDJHK");
  $.ajax('/aaibian/user/login/', {
    type: 'post',
    data: $.param({"api_key":"1698c2bea6c8000723d5bb70363a8352d846917et41GuPJ",
	                 "user_name": "ahmed@alaa.com",
	                  "password": "Alaa"}),
    success: function(data) {
        console.log("herewresdfsdfdsklfghdslkjhfgkljsdhfgkj");
    }
  }, true);
}
