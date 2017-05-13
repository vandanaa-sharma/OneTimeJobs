
//** Get user's geo-location **/
/** TODO - read this location only once in a session and use it on all pages **/

window.onload = function() {
  var startPos;
  var geoOptions = {
    enableHighAccuracy: true
  }

  var geoSuccess = function(position) {
    startPos = position;
  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
    //   Error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

$(document).ready(function()
{
    var password = document.getElementById('password');
    var cpassword = document.getElementById('confirmpassword');
    var checkPasswordValidity = function() {
      if (password.value != cpassword.value || password.length < 6) {
        password.setCustomValidity('Passwords must be at least 6 characters and must match.');
      } 
      else {
        password.setCustomValidity('');
      }        
    };
    password.addEventListener('change', checkPasswordValidity, false);
    cpassword.addEventListener('change', checkPasswordValidity, false);
});
