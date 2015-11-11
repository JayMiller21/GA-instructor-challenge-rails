$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them
  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready() 

  // Define behavior to occur upon submission of movie search form
  $("#movie_search_form").on('submit',function(event) {

    // prevent default behavior (page reload) upon submit - ajax will display the search results without page reload.
    event.preventDefault();

    // 
    $.ajax({
      type: "POST",
      url: "/",
      dataType: "json",
      // 
      data:$("#movie_search_form").serialize()

    // Specifies what is to happen following submission of movie search form   
    }).done(function(response){

      var omdbRequestUrl = "http://www.omdbapi.com/?s=" + response.title;

      // request search results from OMDB API
      $.ajax({
        url: omdbRequestUrl,
        dataType: "json",
        success: function( data ) {
          
          var movies = data.Search; 

          // Clear previous search results from window
          $( "#results" ).html("");

          // Display all resulting movie titles from search
          $.each( movies, function( i, item ) {

              var movieHtml = "<div class='result'><p class='movie-title' style='display:inline-block'>" + item.Title + "</p><button type='button' class='favorite-button' style='display:inline-block'>Favorite</button></div>";
              $( "#results" ).append( movieHtml );

              // Create hidden element with more detail on each resulting movie from OMDB
              var omdbRequestUrlDetailed = "http://www.omdbapi.com/?t=" + item.Title.replace(/\s+/g, '+').toLowerCase();

              $.ajax({
                url: omdbRequestUrlDetailed,
                dataType: "json",
                success: function( data ) {
                  // alert(JSON.stringify(data));
                  var moviePlotHtml = "<p class='movie-plot' style='display:none'>" + data.Plot + "</p>"
                  var movieDiv = $('#results').find('#result-' + (i+1));
                  $(movieDiv).append(moviePlotHtml)
                }
              });

          });

          // Assign a unique id to each movie result element so that each may be appended with corresponding details upon user click
          $('.result').attr('id', function(i) {
            return 'result-'+(i+1);
          });
        }

      });

    });
  });

  // When user clicks a movie result, display movie details.
  $('#results').on('click', ".result > .movie-title", function(event) { 

    $(this).parent().find('.movie-plot').toggle();

  });

  // When user clicks favorite button, save to favorites
  $('#results').on('click', '.favorite-button', function(event) { 

    var movieTitle = $(this).parent().find('.movie-title').text();
    var omdbRequestUrlDetailed2 = "http://www.omdbapi.com/?t=" + movieTitle.replace(/\s+/g, '+').toLowerCase();

    // Get all movie details from OMDB server
    $.ajax({
      url: omdbRequestUrlDetailed2,
      dataType: "json",
      success: function( data ) {
        alert("Favorite added!");
        var favoriteObject = { title: data.Title, imdb_id: data.imdbID };

        // Send favorited-movie data to back end
        $.ajax({
          url: '/favorites/new',
          dataType: 'json',
          contentType: 'application/json',
          type: 'POST',
          data: JSON.stringify(favoriteObject)
          // success: function() {
          //   alert("Favorite added!");
          // }
        });
      }
    });


  });

});
