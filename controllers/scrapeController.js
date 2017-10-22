var express = require("express");
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");


// Initialize Express
var router = express.Router();

// Require all models
var Article = require("../models/Article.js");
var Note = require("../models/Note.js");



// Routes
router.get("/", function (req, res) {
  Article.find({}).then(function (found) {

    var hbsObject = {
      Article: found
    }
    //  console.log(hbsObject);         
    res.render("index", hbsObject);
  }).catch(function (err) {
    // If an error occurred, send it to the client
    res.json(err);
  });

});



// A GET route for scraping the NPR website
router.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.npr.org/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every div within an article tag, and do the following:
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

        // Create a new Article using the `result` object built from scraping
        Article
          .create(result)
          .then(function (dbArticle) {
            // If we were able to successfully scrape and save an Article, redirect to home
            res.redirect("/");
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
          });

      } // end of create

    });
  });

});

// Route for saving/updating an Article's save status
router.get("/save/:id", function (req, res) {

  Article.findByIdAndUpdate(req.params.id, {
      $set: {
        saveArticle: true
      }
    }, {
      new: true
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, redirect to home

      res.redirect("/");
    })

    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



// Route for deleting/updating an Article's saved status
router.get("/delete/:id", function (req, res) {

  Article.findByIdAndUpdate(req.params.id, {
      $set: {
        saveArticle: false
      }
    }, {
      new: true
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client

      res.redirect("/saved");
    })

    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});






// Route for saving/updating an Article's associated Note
router.get("/saved", function (req, res) {

  Article.find({}).populate("note").exec(function (err, data) {

    res.render("savedPanel", {
      Article: data,
    })
  })
})



router.post("/addnote/:data", function (req, res) {

  var bodyId = req.params.data.split(",");

  var newNote = {
    body: bodyId[0]
  }
  console.log("hey this bbody " + req.body);
  Note.create(newNote, function (err, newNote) {
    if (err) {
      throw err;
    }
    Article.findOneAndUpdate({
      _id: bodyId[1]
    }, {
      $push: {
        "note": newNote._id
      }
    }, {
      new: true
    }, function (err, update) {
      if (err) {
        throw err;
      }
      res.send(update);
    })
  })
})



// Route for removing a specific note by id
router.get("/remove/:id", function (req, res) {

  Note.findOneAndRemove({
    _id: req.params.id
  }, function (err, delNote) {
    if (err) {
      throw err;
    }

    res.send(delNote)
  })


});



// Export routes for server.js to use.
module.exports = router;