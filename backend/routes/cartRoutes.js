const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} = require("../controllers/cartController");

router.get("/", auth, getCart);
router.post("/", auth, addToCart);
router.put("/:productId", auth, updateQuantity);
router.delete("/:productId", auth, removeFromCart);

module.exports = router;
