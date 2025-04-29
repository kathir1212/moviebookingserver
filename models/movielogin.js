const mongoose = require("mongoose");


const MovieUsersLoginSchema = new mongoose.Schema({



email : {
    type: String,
    required: true,
},

password : {
    type: String,
    required: true,
},


});


const MovieUserLogin = mongoose.model("user", MovieUsersLoginSchema);


module.exports = MovieUserLogin;

