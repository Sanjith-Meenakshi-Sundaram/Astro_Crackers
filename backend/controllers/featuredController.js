const FeaturedProduct = require('../models/FeaturesProduct');

// @desc    Add Featured Product
// @route   POST /api/featured
// @access  Private (Owner/Admin)
exports.addFeatured = async (req, res) => {
  try {
    const { name, description, price, images, category, tags } = req.body;

    if (!name || !description || !price || !images || images.length === 0 || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const featured = new FeaturedProduct({
      name,
      description,
      price,
      images,
      category,
      tags
    });

    const createdFeatured = await featured.save();
    res.status(201).json(createdFeatured);

  } catch (error) {
    console.error('Error adding featured product:', error);
    res.status(500).json({ message: 'Server error while adding featured product' });
  }
};

// @desc    Get all Featured Products
// @route   GET /api/featured
// @access  Public
exports.getFeatured = async (req, res) => {
  try {
    const products = await FeaturedProduct.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Server error fetching featured products' });
  }
};

// @desc    Update Featured Product
// @route   PUT /api/featured/:id
// @access  Private (Owner/Admin)
exports.updateFeatured = async (req, res) => {
  try {
    const product = await FeaturedProduct.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Featured product not found' });

    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.images = req.body.images || product.images;
    product.category = req.body.category || product.category;
    product.tags = req.body.tags || product.tags;

    if (req.body.isActive !== undefined) {
      product.isActive = req.body.isActive;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    console.error('Error updating featured product:', error);
    res.status(500).json({ message: 'Server error updating featured product' });
  }
};

// @desc    Delete Featured Product
// @route   DELETE /api/featured/:id
// @access  Private (Owner/Admin)
exports.deleteFeatured = async (req, res) => {
  try {
    const product = await FeaturedProduct.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Featured product not found' });

    await product.deleteOne();
    res.json({ message: 'Featured product removed' });

  } catch (error) {
    console.error('Error deleting featured product:', error);
    res.status(500).json({ message: 'Server error deleting featured product' });
  }
};
