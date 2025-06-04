const express = require('express');
const stripe = require('stripe')('sk_test_51RJDOmQOvdXjFLizbpLJuRJ4vhnAYiLYVyyNVDkVV8omUeWpG9h5tHGbhyWK91ItCFvsvJ4SI860VjSBHzBggKqB00isfPCqak');
const app = express();

app.use(express.static('public'));

app.use(express.json());

const PRODUCTS = {
  pizza: { name: "Pizza", price: 1000 },
  burger: { name: "Burger", price: 800 },
  pasta: { name: "Pasta", price: 1200 }
};

app.post('/create-checkout-session', async (req, res) => {
  const item = req.body.item;
  const product = PRODUCTS[item];

  if (!product) {
    return res.status(400).send('Invalid product selected');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: product.name },
        unit_amount: product.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:4042/success.html',
    cancel_url: 'http://localhost:4042/cancel.html',
  });

  res.json({ url: session.url });
});

app.listen(4042, () => console.log('✅ Server running at http://localhost:4042'));