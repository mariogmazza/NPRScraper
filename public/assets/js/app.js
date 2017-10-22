
  $(document).on("click", ".notes", function () {
    console.log("this is the modal")

  $(".modal-content").empty()
    $(".modal-title").text($(this).data("title"))
     console.log($(this).data("id"))
    $(".addNote").attr("data-id", $(this).data("id"))



    var thisId = $(this).data("id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function (data) {
       // console.log(data);

            $(".modal-content").append('<div class="modal-header"><a href="#" data-dismiss="modal" class="class pull-right"><span class="glyphicon glyphicon-remove"></span></a><h3 class="modal-title">'+data.title+'</h3></div><div class="modal-body"><div class="row"><div class="col-md-6 product_content"><ul class="myNotes"></ul><h3> Add Notes </h3><div class="row"> <div class="col-md-4 col-sm-12"><textarea id="bodyinput" rows="4" cols="50"></textarea></div></div><div class="space-ten"></div><div class="btn-ground"><button type="button" class="btn btn-primary addNote" data-dismiss="modal" data-id="'+thisId+'">Confirm</button></div></div></div></div>')
         
           // If there's a note in the article
      if (data.note) {
        console.log(data.note.body)
      $(".myNotes").append('<li>'+ data.note.body +'  <a class="btn btn-danger" href="/remove/'+thisId+'">X</a></li><br>')
      }

      });

  })



  // When you click the addNote button
  $(document).on("click", ".addNote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var theNote=$("#bodyinput").val()
  if(theNote){
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $(".modal-title").text(),
        // Value taken from note textarea
        body: theNote
      }
    })
      // With that done
      .done(function (data) {
        // Log the response
        console.log(data.body);
      });
  }

    // Also, remove the values entered in the input and textarea for note entry
    $("#bodyinput").val("");
  });



  