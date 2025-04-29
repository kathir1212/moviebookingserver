const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    showtime: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'showtime',
        required: true 
    },

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true 
    },

    seatsBooked: { 
        type: Number,
        required: true,
        min: 1 
    },

    seatNumbers: { 
        type: [String],  // Array to store seat numbers like ["A1", "A2", "B3"]
        required: true
    },

    bookingDate: { 
        type: Date,
        default: Date.now 
    },

}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
