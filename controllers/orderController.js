const Order = require("../models/order");
const logger = require("../utils/logger");

const createOrder = async (req, res) => {
  try {
    const { customerId, products, total, shippingAddress, name, email } =
      req.body;

    if (!customerId || !products || !total || !shippingAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const orderId = await Order.create({
      customerId,
      products,
      total,
      shippingAddress,
      name,
      email,
      status: "pending", // setting the default status to 'pending' for orders
    });

    logger.info("Order created successfully");
    res.status(201).json({ message: "Order created successfully", orderId });
  } catch (error) {
    logger.error(error);
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

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await Order.updateById(id, data);
    const updatedOrder = await Order.findById(id); // Fetching the updated order
    logger.info(`Order updated successfully with id: ${id}`);
    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder }); // Sending the updated order in the response
  } catch (error) {
    logger.error(`Error updating order: ${error}`);
    res.status(500).json({ message: "Failed to update order" });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await Order.deleteById(id);
    logger.info(`Order deleted successfully with id: ${id}`);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting order: ${error}`);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await Order.findByCustomerId(customerId);
    logger.info(`Orders fetched correctly for customer with ID: ${customerId}`);
    res.status(200).json({ orders });
  } catch (error) {
    logger.error(`Error getting orders by customer ID: ${error}`);
    res.status(500).json({ message: "Failed to get orders" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomerId,
};
