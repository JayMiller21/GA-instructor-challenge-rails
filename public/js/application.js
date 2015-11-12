// Functions are defined first, and will be invoked, or called, later.

// Function to display all resulting movie titles from search
// * This function is long and serves multiple purposes. Dividing it into multiple smaller functions would be beneficial in multiple ways: It would be clearer to read, easier to debug, and easier to alter when the project needs change.
function displaySearchResults(moviesData) {
  var movies = moviesData.Search;
  // Clear previous search results from the screen
  $( "#results" ).html("");
  $.each( movies, function( i, item ) {
    // Create a div element for each movie, which contains the title and a favorite button
    var movieHtml = "<div class='result'><p class='movie-title' style='display:inline-block'>" + item.Title + "</p><button type='button' class='favorite-button' style='display:inline-block'>Favorite</button></div>";
    $( "#results" ).append( movieHtml );
    // Create a hidden element with more detail on each resulting movie from the OMDB API
    // * The OMDB API is set up to respond with certain data when we send an HTTP request, based on the terms in the URL. Here, we are using "t=" with the title of interest - The API returns a JSON object with a series of key value pairs of movie data for the matching title.
    var omdbRequestUrlDetailed = "http://www.omdbapi.com/?t=" + item.Title.replace(/\s+/g, '+').toLowerCase();
    $.ajax({
      url: omdbRequestUrlDetailed,
      dataType: "json"
    }).done(function( data ) {
        var moviePlotHtml = "<p class='movie-plot' style='display:none'>" + data.Plot + "</p>";
        var movieDiv = $('#results').find('#result-' + (i+1));
        $(movieDiv).append(moviePlotHtml);
    });
    // Assign a unique id to each movie result element so that each may be appended with corresponding details upon user click.
    $('.result').attr('id', function(i) {
        return 'result-'+(i+1);
      });
  });
}

// Function to request search results from the OMDB API given the user-submitted form data, and to display search results.
function getAndDisplaySearchResults(formData){
  var omdbRequestUrl = "http://www.omdbapi.com/?s=" + formData.title;
  $.ajax({
    url: omdbRequestUrl,
    dataType: "json"
    // * An AJAX call returns a promise object which will contain the result of the request once it is complete. Calling ".done" or ".then" allows us to pass this result into a subsequent function. 
    // * It is good coding practice to give every function a single responsibility (a descriptive name for a well-written function should not need the word "and"). Ideally, I would not call ".done" from inside this function. I would invoke this separately. I am in the process of implementing a solution in which I chain independent .done statements to be performed one after another, but not in a nested fashion. As mentioned earlier, this will improve code readibility, debugging, and flexibility for future changes.
  }).done(displaySearchResults);
}

// Function to save favorited-movie data on the back end.
function saveFavorite(movieData){
  var movieDataFormatted = { title: movieData.Title, imdb_id: movieData.imdbID };
  $.ajax({
    url: '/favorites/new',
    dataType: 'json',
    contentType: 'application/json',
    type: 'POST',
    data: JSON.stringify(movieDataFormatted)
  });
  alert("Favorite added!");
}

// Function to get additional movie details from the OMDB API and save the favorite.
function getFavoriteDataAndSave(){
  var movieTitle = $(this).parent().find('.movie-title').text();
  var omdbRequestUrlDetailed2 = "http://www.omdbapi.com/?t=" + movieTitle.replace(/\s+/g, '+').toLowerCase();
  $.ajax({
    url: omdbRequestUrlDetailed2,
    dataType: "json"
  }).done(saveFavorite);
}
  
// * The following function is called after the document has loaded in its entirety. This guarantees that any elements we bind to will exist on the page when we try to bind to them.
// * For readability and separation of concerns, it's best to define functions
// before this point, and then call the needed functionality from within this
// function.
$(document).ready(function() {

  // When a user submits the movie search form, request data from the OMDB API, and display results.
  $("#movie_search_form").on('submit',function(event) {
    // * ".preventDefault()" is used to prevent the default behavior upon form submission - in this case, a page reload. We want to stay on the current view, where AJAX will display the search results without a page reload.
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "/",
      dataType: "json",
      data:$(this).serialize()
    }).done(getAndDisplaySearchResults);
  });

  // When a user clicks a movie result, display movie details. 
  // * Because the ".movie-title" elements were not present upon page load, they won't be recognized as elements. In order to access the ".movie-title" elements, we must select a parent element which existed at the time of page load, such as "#results." The ".movie-title" elements were added via AJAX when the user searched for a movie. The page did not reload at this time. 
  $('#results').on('click', ".result > .movie-title", function(event) {
    $(this).parent().find('.movie-plot').toggle();
  });

  // When a user clicks the favorite button, save the corresponding movie to favorites.
  $('#results').on('click', '.favorite-button', getFavoriteDataAndSave);

});
