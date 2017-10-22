// Exporting an object containing all of our models

theTwo = {
    Article: require("./Article"),
    Note: require("./Note")
  };
  
  // Export the Article model
module.exports = theTwo;