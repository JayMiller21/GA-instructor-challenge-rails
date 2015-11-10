$(document).ready(function() {
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
  // 
  
  // xhttp.open("GET","http://www.omdbapi.com/?t=star+wars&y=2000&plot=short&r=json",true);
  // xhttp.send();

  $("#find_movies").on("click", function(event) {

    $.ajax({
      url: "http://www.omdbapi.com/?t=star+wars&y=2000&plot=short&r=json",
      dataType: "json",
      success: function( data ) {
        $( "div#results" ).append( "<p>"+data.Title+"</p>" )
      }

    });

  });

});