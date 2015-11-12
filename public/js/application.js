//Functions are defined first, and will be invoked later.

function requestSearchResultsFromOmdb(formData){

      var omdbRequestUrl = "http://www.omdbapi.com/?s=" + formData.title;

      // request search results from OMDB API
      $.ajax({
        url: omdbRequestUrl,
        dataType: "json"
      }).done(displaySearchResults);
        
    }

// Display all resulting movie titles from search
function displaySearchResults(moviesData) {
  var movies = moviesData.Search;
  // Clear previous search results from window
  $( "#results" ).html("");
  $.each( movies, function( i, item ) {

    var movieHtml = "<div class='result'><p class='movie-title' style='display:inline-block'>" + item.Title + "</p><button type='button' class='favorite-button' style='display:inline-block'>Favorite</button></div>";
    $( "#results" ).append( movieHtml );

    // Create hidden element with more detail on each resulting movie from OMDB
    var omdbRequestUrlDetailed = "http://www.omdbapi.com/?t=" + item.Title.replace(/\s+/g, '+').toLowerCase();

    $.ajax({
      url: omdbRequestUrlDetailed,
      dataType: "json"
    }).done(function( data ) {
        var moviePlotHtml = "<p class='movie-plot' style='display:none'>" + data.Plot + "</p>";
        var movieDiv = $('#results').find('#result-' + (i+1));
        $(movieDiv).append(moviePlotHtml);
    });
    
    // Assign a unique id to each movie result element so that each may be appended with corresponding details upon user click
    $('.result').attr('id', function(i) {
        return 'result-'+(i+1);
      });

  });
}

// Send favorited-movie data to back end
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

// The following is called after the document has loaded in its entirety
// This guarantees that any elements we bind to will exist on the page
// when we try to bind to them
$(document).ready(function() {

  // Define behavior to occur upon submission of movie search form
  $("#movie_search_form").on('submit',function(event) {

    // prevent default behavior (page reload) upon submit - ajax will display the search results without page reload.
    event.preventDefault();

    // Submit search form content
    $.ajax({
      type: "POST",
      url: "/",
      dataType: "json",
      data:$(this).serialize()

    // Specifies what is to happen following submission of movie search form   
    }).done(requestSearchResultsFromOmdb);






  });

  // When user clicks a movie result, display movie details. We must select the "#results" element because it existed on page load, the the child elements that we want to manipulate did not. 
  $('#results').on('click', ".result > .movie-title", function(event) {
    $(this).parent().find('.movie-plot').toggle();
  });

  // When user clicks favorite button, save to favorites
  $('#results').on('click', '.favorite-button', function(event) {

    var movieTitle = $(this).parent().find('.movie-title').text();
    var omdbRequestUrlDetailed2 = "http://www.omdbapi.com/?t=" + movieTitle.replace(/\s+/g, '+').toLowerCase();

    // Get all movie details from OMDB server and save select data to back end. ".done" passes the result of the ajax call to the function saveFavorite, which was defined above, outside of document ready.
    $.ajax({
      url: omdbRequestUrlDetailed2,
      dataType: "json"
    }).done(saveFavorite);

  });

});
