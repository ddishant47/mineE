const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // For now, we'll use a local identifier or 'guest'
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);
