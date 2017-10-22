// // When you click the savenote button
// $(document).on("click", "notes", function() {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");
  
//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         // Value taken from note textarea
//         body: $("#bodyinput").val()
//       }
//     })
//       // With that done
//       .done(function(data) {
//         // Log the response
//         console.log(data);
//       });
  
//     // Also, remove the values entered in the input and textarea for note entry
//     $("#bodyinput").val("");
//   });

  