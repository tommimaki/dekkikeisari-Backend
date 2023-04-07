const Order = require("../models/order");
const logger = require("../utils/logger");

// const createOrder = async (req, res) => {
//   try {
//     const { customerId, products, total, shippingAddress } = req.body;

//     if (!customerId || !products || !total || !shippingAddress) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     await Order.create({ customerId, products, total, shippingAddress });

//     logger.info("Order created successfully");
//     res.status(201).json({ message: "Order created successfully" });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res
//       .status(500)
//       .json({ message: `Failed to create order: ${error.message}` });
//   }
// };

const createOrder = async (req, res) => {
  try {
    const { customerId, products, total, shippingAddress, name, email } =
      req.body;

    if (!customerId || !products || !total || !shippingAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await Order.create({
      customerId,
      products,
      total,
      shippingAddress,
      name,
      email,
    });

    logger.info("Order created successfully");
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: `Failed to create order: ${error.message}` });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    logger.info("Orders fetched correctly");
    res.status(200).json({ orders });
  } catch (error) {
    logger.error(`Error getting orders: ${error}`);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      logger.error(`Order not found with id: ${id}`);
      return res.status(404).json({ message: "Order not found" });
    }

    logger.info(`Order fetched successfully with id: ${id}`);
    res.status(200).json({ order });
  } catch (error) {
    logger.error(`Error getting order by id: ${error}`);
    res.status(500).json({ message: "Failed to get order" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};
