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