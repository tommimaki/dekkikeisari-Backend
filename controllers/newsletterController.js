const { newsletterSubscription } = require("../models/newsletterSubscription");

// const subscribe = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ message: "Email is required" });
//     }
//     await newsletterSubscription.create({ email });
//     res.status(201).json({ message: "Subscribed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: `Failed to subscribe: ${error.message} ` });
//   }
// };
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    await newsletterSubscription.create({ email });
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Error in subscribe controller:", error); // Add this line
    res.status(500).json({ message: `Failed to subscribe: ${error.message} ` });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await newsletterSubscription.findAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to get subscriptions: ${error.message}` });
  }
};

const getSubscriptionByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const subscription = await newsletterSubscription.findByEmail(email);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to get subscription: ${error.message}` });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const id = req.params.id;

    await newsletterSubscription.delete(id);
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to delete subscription: ${error.message}` });
  }
};

module.exports = {
  subscribe,
  getAllSubscriptions,
  getSubscriptionByEmail,
  deleteSubscription,
};
