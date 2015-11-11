$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them
  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready() 

  $("#movie_search_form").on('submit',function(event) {

    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/",
      dataType: "json",
      data:$("#movie_search_form").serialize()
    }).done(function(response){

      omdbRequestUrl = "http://www.omdbapi.com/?s=" + response.title

      $.ajax({
        url: omdbRequestUrl,
        dataType: "json",
        success: function( data ) {
          // alert(JSON.stringify(data));
          movies = data.Search
          $.each( movies, function( i, item ) {
              var newListItem = "<p>" + item.Title + "</p>";
              $( "#results" ).append( newListItem );
          });
        }
      });

    });
    });

});
