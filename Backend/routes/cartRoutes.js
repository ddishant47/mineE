const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Sync or Update Cart
router.post("/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;
    
    // UPSERT: Create if not exists, update if exists
    let cart = await Cart.findOneAndUpdate(
      { userId },
      { items, updatedAt: Date.now() },
      { returnDocument: 'after', upsert: true }
    );
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Cart for User
router.get("/cart/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
