var express = require("express");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");


// Initialize Express
// var app = express();
var router = express.Router();


// Require all models
var theTwo = require("../models/theTwo.js");
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");



// Routes
// Users\DJMONO\Desktop\code\HOMEWORK\thescraper\models


// router.get("/", function (req, res) {

//     res.render("index");

// });



  router.get("/", function(req, res) {
    Article.find({}).then(function(found){

         var hbsObject={
             Article:found
         }
        //  console.log(hbsObject);         
        res.render("index",hbsObject);        
    }).catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });

  });






// A GET route for scraping the echojs website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("http://www.npr.org/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".story-wrap").each(function (i, element) { // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            var title = $(element).find(".title").text().trim();
            var teaser = $(element).find(".teaser").text().trim();
            var link = $(element).find("a:nth-child(1)").attr("href");

            if (title !== undefined && teaser !== undefined && link !== undefined) {

                result.title = title;
                result.teaser = teaser;
                result.link = link;
            
            // console.log(result.teaser);
            // console.log(result.title);
            // console.log(result.link);

            // console.log("hey im in");

            // Create a new Article using the `result` object built from scraping
            Article
                .create(result)
                .then(function (dbArticle) {
                    // If we were able to successfully scrape and save an Article, send a message to the client
                    res.redirect("/");
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });

            }// end of create

        });
    });

});


//   // Route for grabbing a specific Article by id, populate it with it's note
//   router.get("/articles/:id", function(req, res) {
//     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//     Article
//       .findOne({ _id: req.params.id })
//       // ..and populate all of the notes associated with it
//       .populate("note")
//       .then(function(dbArticle) {
//         // If we were able to successfully find an Article with the given id, send it back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

  // Route for saving/updating an Article's associated Note
  router.get("/save/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    
    Article.findByIdAndUpdate(req.params.id , { $set: { saveArticle: true }}, { new: true })     
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
       
        res.redirect("/");
      })

      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



// Route for deleting/updating an Article's associated Note
router.get("/delete/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    
    Article.findByIdAndUpdate(req.params.id , { $set: { saveArticle: false }}, { new: true })     
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
       
        res.redirect("/saved");
      })

      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });






 // Route for saving/updating an Article's associated Note
 router.get("/saved", function(req, res) {
    // Create a new note and pass the req.body to the entry
    
    Article.find({}).then(function(found){
        
                 var hbsObject2={
                     Article:found
                 }
                //  console.log(hbsObject2);         
                res.render("savedPanel",hbsObject2);   

     })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });






// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    Note
      .create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  // Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article
      .findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });





// Export routes for server.js to use.
module.exports = router;