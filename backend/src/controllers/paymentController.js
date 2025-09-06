import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
import logger from '../utils/logger.js';
import { validatePayment } from '../validators/paymentValidator.js';

export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency, metadata = {} } = req.body;
        
        // Validate payment data
        const validation = validatePayment({ amount, currency });
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        // Validate currency is supported
        const supportedCurrencies = ['usd', 'eur', 'gbp'];
        if (!supportedCurrencies.includes(currency.toLowerCase())) {
            return res.status(400).json({ error: 'Unsupported currency' });
        }

        logger.info(`Creating payment intent for ${amount} ${currency}`);
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency.toLowerCase(),
            metadata,
            payment_method_types: ['card']
        });

        logger.info(`Payment intent created: ${paymentIntent.id}`);
        res.status(200).json({ 
            clientSecret: paymentIntent.client_secret,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency
        });
    } catch (error) {
        logger.error(`Payment error: ${error.message}`, { stack: error.stack });
        
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ 
                error: 'Payment processing error',
                details: error.message
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to create payment intent',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    createPaymentIntent
};
