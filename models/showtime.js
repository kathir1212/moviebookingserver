const mongoose = require('mongoose');
const threater = require('../models/threaters')
const showtimeSchema = new mongoose.Schema({
    movie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "movie", 
        required: true 
    },
    threater: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "threater", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
 
        time: [{
            type: String, 
            required: true 
 } ]
    ,
    
    seatsoccupied:[{ 
        type: Number, 
        required: true, 
        min: 0 
    }],
    
    ticketPrice: { 
        type: Number, 
        required: true 
    }
}, { timestamps: true });

const Showtime = mongoose.model("showtime", showtimeSchema);

module.exports = Showtime;
