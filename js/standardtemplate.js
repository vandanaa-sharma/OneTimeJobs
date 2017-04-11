
/** This is a template writer for all html files which includes standard header footer and content in the head section 
/** Modifying this file will reflect changes in all html file **/
/** CSS is being used from  standard css file - css/style.css file **/
/** Use - http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/ to convert HTML to JS easily for editing this file **/


$(document).ready(function()
{

	// jQuery methods go here...

	/** HEAD **/
	var headContent = "";

	headContent += "		<!-- Make your page mobile friendly -->		";
	headContent += "		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">";
	headContent += "		<meta charset=\"ISO-8859-1\">";
	headContent += "		<!-- Here rel means \"relationship\" this document has to the document being linked -->";
	headContent += "		<!-- href stands for hypertext reference -->";
	headContent += "		<link rel=\"stylesheet\" href=\"\/style.css\" type=\"text\/css\" >";
	headContent += "		<!-- Set icons -->";
	headContent += "		<link rel=\"icon\" href=\"\/our_logo_mobile.png\">";
	headContent += "		<link rel=\"shortcut icon\" href=\"\/our_logo_mobile.png\">";

	$("head").html(headContent);

	/** HEADER **/
	var header = "";

	header += "<header>";
	header += "				<div id=\"content\">";
	header += "					<div class=\"slicknav_menu\">";
	header += "						<script defer=\"\" src=\"https:\/\/ajax.googleapis.com\/ajax\/libs\/jquery\/2.1.3\/jquery.min.js\"><\/script>";
	header += "						<!-- TODO - make slick nav menu work on mobile browsers -->";
	header += "						<a style=\"outline: medium none;\" href=\"#\" aria-haspopup=\"true\" tabindex=\"0\" class=\"slicknav_btn slicknav_collapsed\">";
	header += "							<span class=\"slicknav_menutxt\"><\/span>";
	header += "							<span class=\"slicknav_icon slicknav_no-text\">";
	header += "                        		<span class=\"slicknav_icon-bar\"><\/span>";
	header += "                        		<span class=\"slicknav_icon-bar\"><\/span>";
	header += "                        		<span class=\"slicknav_icon-bar\"><\/span>";
	header += "							<\/span>";
	header += "						<\/a>";
	header += "						<ul role=\"menu\" aria-hidden=\"true\" style=\"display: none;\" class=\"slicknav_nav slicknav_hidden\">";
	header += "							<li><a tabindex=\"-1\" role=\"menuitem\" href=\"#\">Browse<\/a><\/li>";
	header += "							<li><a tabindex=\"-1\" role=\"menuitem\" href=\"#\">Quizzes<\/a><\/li>";
	header += "							<li><a tabindex=\"-1\" role=\"menuitem\" href=\"#\">Help<\/a><\/li>";
	header += "						<\/ul>";
	header += "					<\/div>";
	header += "					<a href=\"#\" class=\"home\"><\/a>";
	header += "					<div class=\"hSpace\"><\/div> <div class=\"hSpace\"><\/div>";
	header += "					<form action=\"#\" method=\"post\" id=\"search\">";
	header += "						<div id=\"swrap\">";
	header += "							<input autocomplete=\"off\" name=\"term\" id=\"term\" tabindex=\"1\" placeholder=\"Search\" type=\"text\">";
	header += "						<\/div>";
	header += "					<\/form>";
	header += "					<a href=\"#\" class=\"search_jobs\" title=\"Search Jobs\"><\/a>";
	header += "					<nav>";
	header += "						<ul id=\"menu\">";
	header += "							<li><a href=\"#\">Browse Jobs<\/a><\/li>";
	header += "							<li><a href=\"#\">About Us<\/a><\/li>";
	header += "							<li><a href=\"#\">Contact Us<\/a><\/li>";
	header += "						<\/ul>";
	header += "					<\/nav>";
	header += "				<\/div>";
	header += "			<\/header>";

	$("#header").html(header);

	/** FOOTER **/
	var footer ="";
	footer += "<footer>";
	footer += "		  <a href=\"#\">";
	footer += "		  	<span class=\"copyright\">© 2017 Our Company Name <\/span>";
	footer += "		  <\/a> &nbsp;|&nbsp; ";
	footer += "		  <a href=\"#\">Terms of Use<\/a> &nbsp;|&nbsp; ";
	footer += "		  <a href=\"#\">Privacy Policy<\/a> &nbsp;|&nbsp; ";
	footer += "		  <a href=\"file:\/\/\/D:\/about\">About<\/a> &nbsp;|&nbsp; ";
	footer += "		  <a href=\"#\">Contact<\/a>";
	footer += "	   <\/footer>";

	$("#footer").html(footer);

});



