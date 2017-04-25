

function login_button_activate() {
  $.ajax('home', {
    type: 'post',
    data: $.param({ "ahmed": "good" }),
    success: function(data) {
      //document.location = "/trial_data";
      //document.getElementById("header").innerHTML = "<h1>AHmed ALAAAAAA</h1>";
      $( "#header" ).load( "/logging_panel.html");
     }
  });
}
