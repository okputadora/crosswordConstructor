// global variables
var username = "default";
var userID = 1023;


// This is called with the results from from FB.getLoginStatus().
 function statusChangeCallback(response) {
   console.log('statusChangeCallback');
   console.log(response);
   // The response object is returned with a status field that lets the
   // app know the current login status of the person.
   // Full docs on the response object can be found in the documentation
   // for FB.getLoginStatus().
   if (response.status === 'connected') {
     // Logged into your app and Facebook.
     displayUserProfile();
   } else {
     // The person is not logged into your app or we are unable to tell.
     document.getElementById('status').innerHTML = 'Please log ' +
       'into this app.';
   }
 }

 // This function is called when someone finishes with the Login
 // Button.  See the onlogin handler attached to it in the sample
 // code below.
 function checkLoginState() {
   FB.getLoginStatus(function(response) {
     statusChangeCallback(response);
   });
 }

 window.fbAsyncInit = function() {
 FB.init({
   appId      : '1853245974998322',
   cookie     : true,  // enable cookies to allow the server to access
                       // the session
   xfbml      : true,  // parse social plugins on this page
   version    : 'v2.8' // use graph api version 2.8
 });

 FB.getLoginStatus(function(response) {
   statusChangeCallback(response);
 });

 };

 // Load the FB SDK asynchronously
 (function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) return;
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

 function displayUserProfile(){
   FB.api('/me', function(response){
     username = response.name;
     userID = response.id;
     $("#user").html("<div id='username'>" + response.name + "</div");
     FB.api("/"+ response.id +"/picture", function (response) {
       if (response && !response.error) {
         // change profile to user image
         $("#user").append("<img id='userpic' width = '25px' heigth = '25px' src = '" + response.data.url  + "'/>");
         console.log(response.data.url);
         // display profile page
         // EDIT LATER - NEEDS TO MATCH ACTUAL FILE STRUCTURE OF LIVE SITE
         window.location.href = "localhost/crossword/profile.php/?id=" + userID + "&n=" + username;
       }
     });
   });
  }
$(document).ready(function(){
  $("#user").on("click", function(){
    console.log("INHERE " + userID + username);
    if(userID){
    // EDIT LATER - NEEDS TO MATCH ACTUAL FILE STRUCTURE OF LIVE SITE
      window.location.href = "profile.php/?id=" + userID + "&n=" + username;
    }
    else{
      // promt them to login
    }

  });
  $("#fbl").on("click", function(){
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  });

  $("#settings").on("click", function(){
    // LOGOUT of FB
    console.log("gettin a click");
    FB.logout(function(response) {
      console.log(response);
      // switch profile picture back to anon
      $("#user").html('<i class="fa fa-user" aria-hidden="true"></i></div>');
   });
  })

 });
