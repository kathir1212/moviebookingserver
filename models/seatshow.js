const mongoose = require('mongoose');

const seatShowSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  movieName: String,
  theater: String,
  time: String,
  price: Number,
  occupied: [Number], // array of occupied seat indexes
});

module.exports = mongoose.model('SeatShow', seatShowSchema);
