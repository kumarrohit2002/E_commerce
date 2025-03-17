const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode:process.env.PAYPAL_mode,
  client_id: process.env.PAYPAL_client_id,
  client_secret:process.env.PAYPAL_client_secret,
});

module.exports = paypal;
