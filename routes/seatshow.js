const express = require('express');
const router = express.Router();
const SeatShow = require('../models/seatshow'); // model we'll create below

// Route to get specific show info including occupied seats
router.get('/showseat/:id', async (req, res) => {
  try {
    const show = await SeatShow.findById(req.params.id);
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving showtime', error: err });
  }
});



module.exports = router;
