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
      url: "http://www.omdbapi.com/?s=star+wars",
      dataType: "json",
      success: function( data ) {

        alert(JSON.stringify(data));

        $( "div#results" ).append( 
          
          "<p>"+data.Search[0].Title+"</p>" )
      }

    });

  });


  $("#movie_search_form").on('submit',function(event) {

    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/",
      dataType: "json",
      data:$("#movie_search_form").serialize()
      // success: function(response){$("#results").append("<p>"+response+"</p>")}
    }).done(function(response){

      omdbRequestUrl = "http://www.omdbapi.com/?s=" + response.title

      // $("#results").append(
      //   "<p>"+omdbRequestUrl+"</p>"

      //   // "<li><div id='movie_result'><p>" + response.comment + "</p></div></li><br>"
      //   )

      $.ajax({
        url: omdbRequestUrl,
        dataType: "json",
        success: function( data ) {
          $( "div#results" ).append( "<p>"+data.Title+"</p>" )
        }
      });


    });

    });






});
