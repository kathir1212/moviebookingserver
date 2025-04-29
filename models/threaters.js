const mongoose = require("mongoose");


const threaterSchema = new mongoose.Schema({

threater_name : {
    type: String,
    required: true,
},

threater_location : {
    type: String,
    required: true,
},

phone_no : {
    type: Number,
    required: true,
}



});


const threaterlist = mongoose.model("threater", threaterSchema);


module.exports = threaterlist;

