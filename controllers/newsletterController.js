const { newsletterSubscription } = require("../models/newsletterSubscription");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await newsletterSubscription.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: `Failed to subscribe: ${error.message} ` });
  }
};

module.exports = {
  subscribe,
};
