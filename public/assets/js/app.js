
  $(document).on("click", ".removeB", function () {
    
     console.log($(this).data("id"))

    var thisId = $(this).data("id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/remove/"+thisId
    })
      // With that done, add the note information to the page
      .done(function (data) {
      //  console.log(data);
      window.location.href = "/saved";
      
      });

  })



  // When you click the addNote button
  $(document).on("click", ".addNote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var theNote=$("#"+thisId).val()
console.log("this is the node post"+theNote);
  if(theNote){
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/addnote/"+theNote+","+thisId
    })
      // With that done
      .done(function (data) {
        // Log the response
        // console.log(data.body);
        window.location.href = "/saved";
        
      });
  }

    // Also, remove the values entered in the input and textarea for note entry
    $("#"+thisId).val("");
  });



  