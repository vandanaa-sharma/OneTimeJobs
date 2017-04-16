
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
    // error.code can be:
    //   0: unknown error
    //   1: permission denied
    //   2: position unavailable (error response from location provider)
    //   3: timed out
  };
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};

function validateForm()
{
	/** TODO - Validate all input fields **/
	 console.log("Validate form called");
}
function _showError(data)
{
	/** Display error div **/
	var element = document.getElementByID('error');
	element.style.display = 'block';
	return false;
}