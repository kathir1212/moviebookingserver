const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // The booking that this payment corresponds to
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The user who made the payment
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Total amount paid
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'wallet'], // Supported payment methods
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'canceled'], // Payment status
    default: 'pending',
  },
  transactionId: {
    type: String,
    unique: true, // Ensure unique transaction ID
  },
  date: {
    type: Date,
    default: Date.now, // Store the date of the transaction
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
