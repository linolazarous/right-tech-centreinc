const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

   exports.createPaymentIntent = async (req, res) => {
       try {
           const { amount, currency } = req.body;
           const paymentIntent = await stripe.paymentIntents.create({
               amount,
               currency,
           });
           res.status(200).json({ clientSecret: paymentIntent.client_secret });
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };