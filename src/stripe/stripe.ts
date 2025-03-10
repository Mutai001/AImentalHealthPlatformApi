import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing Stripe Secret Key. Please set the STRIPE_SECRET_KEY environment variable.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-01-27.acacia',
});
