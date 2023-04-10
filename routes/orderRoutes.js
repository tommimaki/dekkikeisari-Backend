const express = require("express");
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByCustomerId,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/customer/:customerId", getOrdersByCustomerId);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
