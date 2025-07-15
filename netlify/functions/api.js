const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.netlify.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;

    res.json({ user: data.user, message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    res.json({ user: data.user, session: data.session });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Payment routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transaction routes
app.get('/api/transactions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (txError) throw txError;

    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { type, amount, description, metadata } = req.body;

    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        type,
        amount,
        description,
        metadata,
        status: 'pending'
      }])
      .select()
      .single();

    if (txError) throw txError;

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Service routes
app.post('/api/pay-bill', async (req, res) => {
  try {
    const { billType, amount, accountNumber } = req.body;
    
    // Simulate bill payment processing
    const transaction = {
      id: Date.now(),
      type: 'bill_payment',
      amount,
      status: 'completed',
      description: `${billType} bill payment`,
      metadata: { accountNumber }
    };

    res.json({ 
      message: 'Bill payment initiated successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trade-crypto', async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    
    // Simulate crypto trading
    const transaction = {
      id: Date.now(),
      type: 'crypto_trade',
      amount,
      status: 'completed',
      description: `Trade ${fromCurrency} to ${toCurrency}`,
      metadata: { fromCurrency, toCurrency }
    };

    res.json({ 
      message: 'Crypto trade executed successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/trade-giftcard', async (req, res) => {
  try {
    const { cardType, amount, cardNumber } = req.body;
    
    // Simulate gift card trading
    const transaction = {
      id: Date.now(),
      type: 'giftcard_trade',
      amount,
      status: 'pending',
      description: `${cardType} gift card trade`,
      metadata: { cardType, cardNumber }
    };

    res.json({ 
      message: 'Gift card trade initiated successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/p2p', async (req, res) => {
  try {
    const { type, amount, currency, rate } = req.body;
    
    // Simulate P2P transaction
    const transaction = {
      id: Date.now(),
      type: 'p2p_transaction',
      amount,
      status: 'pending',
      description: `P2P ${type} transaction`,
      metadata: { currency, rate }
    };

    res.json({ 
      message: 'P2P transaction created successfully',
      transaction 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);