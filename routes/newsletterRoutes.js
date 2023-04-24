const express = require("express");
const router = express.Router();
const {
  subscribe,
  getAllSubscriptions,
  getSubscriptionByEmail,
  deleteSubscription,
} = require("../controllers/newsletterController");

// Subscribe to the newsletter
router.post("/subscribe", subscribe);
// Get all newsletter subscriptions
router.get("/subscriptions", getAllSubscriptions);
// Get a newsletter subscription by email
router.get("/subscription/:email", getSubscriptionByEmail);
// Delete a newsletter subscription by email
router.delete("/subscription/:email", deleteSubscription);

module.exports = router;
