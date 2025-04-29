const express = require('express');
const router = express.Router();
const Booking = require('../models/moviebooking');
const auth = require('../middleware/authMiddleware')
router.get('/' ,async (req, res) => {
    try {
        const moviebooking = await Booking.find().populate({
            path: "showtime",
            populate: [{ path: "movie" }, { path: "threater" }]
          })
          .populate("user");
        res.json({message:"movies saved successfuly", data : moviebooking});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/ticket', async (req, res) => {
    console.log("showtime");
    
    try {
        const newShowtime = new Booking({
            showtime: req.body.showtime,
            user: req.body.user,
            seatsBooked: req.body.seatsBooked,
            seatNumbers:req.body.seatNumbers,
            bookingDate: req.body.bookingDate
        });

        

        const savedShowtime = await newShowtime.save();
        res.status(201).json(savedShowtime);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Cancel booking by ID
router.delete('/ticket/:id', async (req, res) => {
    try {
      const bookingId = req.params.id;
  
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);
  
      if (!deletedBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      res.json({ message: "Booking cancelled successfully", data: deletedBooking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
