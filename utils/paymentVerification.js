const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Set your Stripe secret key here

// Function to verify payment with Stripe
const verifyPayment = async (transactionId, amount) => {
  try {
    // Retrieve the payment intent details from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(transactionId);

    // Verify if the payment was successful and matches the amount
    if (paymentIntent.status === 'succeeded' && paymentIntent.amount_received === amount * 100) {
      return true; // Payment is verified
    } else {
      return false; // Payment failed or does not match the expected amount
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false; // Payment verification failed
  }
};

module.exports = { verifyPayment };
