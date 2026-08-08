const env = require('../config/env')

function whatsappWebhookMiddleware(req, res, next) {
  if (!env.whatsappWebhookSecret) {
    return next()
  }

  const secret = req.headers['x-webhook-secret']

  // if (secret !== env.whatsappWebhookSecret) {
  //   return res.status(401).json({
  //     message: 'Webhook WhatsApp tidak valid.',
  //   })
  // }

  next()
}

module.exports = whatsappWebhookMiddleware
