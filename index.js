import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

// Create PaymentIntent for Stripe payment
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Example routes for other services
app.post('/api/pay-bill', (req, res) => {
  res.json({ message: 'Bill payment initiated.' });
});

app.post('/api/trade-crypto', (req, res) => {
  res.json({ message: 'Crypto trade executed.' });
});

app.post('/api/trade-giftcard', (req, res) => {
  res.json({ message: 'Gift card trade successful.' });
});

app.post('/api/p2p', (req, res) => {
  res.json({ message: 'P2P transaction created.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
