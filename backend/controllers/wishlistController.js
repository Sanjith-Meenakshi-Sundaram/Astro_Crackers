const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price images"
    );

    if (!wishlist) {
      return res.json({ items: [] });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, items: [] });
    }

    const alreadyAdded = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (alreadyAdded) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error("Add to Wishlist Error:", error);
    res.status(500).json({ message: "Server error adding to wishlist" });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    console.error("Remove From Wishlist Error:", error);
    res.status(500).json({ message: "Server error removing from wishlist" });
  }
};
