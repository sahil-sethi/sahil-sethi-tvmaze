// Setting up an empty object that will contain all the properties and methods for my app
var app = {};

// Starting the app by calling the init method we have created below
$(function(){
	app.init(); 
});
			
// Init method that will be responsible for preparing the form submit event listener
app.init = function(){
	$('form').on('submit', function(e){
		// Prevent default refreshing of page on form submit
		e.preventDefault();
		// Storing the value of the user's input in a variable
		var userSearchQuery = $('.main-search').val();
		// Clearing the main page section for the newly retrieved results
		$('.main-content-area').empty();
		// Calling the fetchItems method as they relate to the user's input
		app.fetchItems(userSearchQuery);
	});
};
			
// Setting up fetchItems method that will be passed the user's input as an argument
app.fetchItems = function(query){
	$.ajax({
		// Using the show search functionality as per TVMaze's API (our endpoint)
		url: 'http://api.tvmaze.com/search/shows',
		// Our AJAX call will be done via the GET method to get items from the API
		method: 'GET',
		// Specifying the data type we want to retrieve
		dataType: 'json',
		// Prepending our URL/endpoint with the following parameters
		data: {
			// q represents the user's query
			q: query
		},
		// Specifying behaviour upon successful AJAX call
		success: function(result){
			app.addToPage(result);
		},
		// Specifying behaviour upon unsuccessful AJAX call
		error: function(error){
			// Simply logging the error to the console
			console.log(error);
		}
	});
};

app.addToPage = function(showResultArray){
	// console.log(result); Logging the result array of objects to the console -- uncomment for reference
	// For each show item in the returned array of objects we want to create elements to be displayed on the page
	showResultArray.forEach(function(showResult){
		
		// Preparing variables for use in appending
		var name = showResult.show.name;
		var premier = showResult.show.premiered;
		var url = showResult.show.url;
		var summary = showResult.show.summary;
		// Setting up a grab image function that is responsible for bringing back any image (or image placeholder) that is available
		var image_url = function(){
			// If no dedicated image exists for a certain show, I have put an image placeholder
			if(showResult.show.image == null){
				return "no-img-portrait-text.png";
			// Else if the show has a dedicated image, we will favour the medium version to be brought back
			} else if (showResult.show.image.medium){
				return showResult.show.image.medium;
			} else if (showResult.show.image.original) {
				return showResult.show.image.original;
			}
		};



		// Using contatenation, we are essentially creating new elements for the page that will contain the respective variable information above
		$(".main-content-area").append("<div class='well col-lg-6 col-md-6 col-sm-6 col-lg-offset-3 col-md-offset-3 col-sm-offset-3'><p class='bold-title pull-left'>" + name + "&nbsp|&nbsp" + "</p>" + "<p class='pull-left'>" + premier + "</p>" + "<a class='info-button' href='" + url + "' target='_blank'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>" + "<div class='summary pull-left'>" + summary + "</div>" + "<a href='"+ image_url() + "' target='_blank'><img class='pull-right' src='"+ image_url() + "'></a>" + "</div>");

		// For each show genre item that exists for a show we want to add this in after the info button we have created
		showResult.show.genres.forEach(function(showGenreItem){
			$(".info-button").last().after("<span class='label label-danger'>" + showGenreItem + "</span>");
		});

	});
};
