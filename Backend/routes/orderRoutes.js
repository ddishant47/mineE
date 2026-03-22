const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/checkout", async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order({
      items,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
