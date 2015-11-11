$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them
  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready() 

  // Define behavior to occur upon submission of movie search form
  $("#movie_search_form").on('submit',function(event) {

    // prevent default behavior upon submit
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

      var omdbRequestUrl = "http://www.omdbapi.com/?s=" + response.title

      // request search results from OMDB API
      $.ajax({
        url: omdbRequestUrl,
        dataType: "json",
        success: function( data ) {
          
          var movies = data.Search; 
          alert(JSON.stringify(data));

          // Clear previous search results from window
          $( "#results" ).html("");

          // Display all resulting movie titles from search
          $.each( movies, function( i, item ) {

              var movieHtml = "<div class='result'><p class='movie-title'>" + item.Title + "</p></div>";
              $( "#results" ).append( movieHtml );

              // Create hidden element with more detail on each resulting movie from OMDB
              var omdbRequestUrlDetailed = "http://www.omdbapi.com/?t=" + item.Title.replace(/\s+/g, '+').toLowerCase();

              $.ajax({
                url: omdbRequestUrlDetailed,
                dataType: "json",
                success: function( data ) {
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
  // $(".result").on('click',function(event) {
    // TODO: get the id number from the element id
    // TODO: unhide the additional details (toggle so second click re-hides)

  // });

});
