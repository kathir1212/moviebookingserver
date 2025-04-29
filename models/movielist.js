const mongoose = require("mongoose");
const threater = require('../models/threaters')

const movielistSchema = new mongoose.Schema({
    Title: String,
    Year: String,
    imdbID: String,
    Type: String,
    Poster: String,
   
});

const Movie = mongoose.model("movie", movielistSchema);

module.exports = Movie;



