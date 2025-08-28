const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/owner/products
// @access  Private/Owner
exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      tags,
      isBestSeller,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      tags,
      isBestSeller,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Server error while adding product' });
  }
};

// @desc    Update a product
// @route   PUT /api/owner/products/:id
// @access  Private/Owner
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // THIS IS THE CORRECTED LOGIC
      // Only update fields if they are provided in the request body
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.images = req.body.images || product.images;
      product.category = req.body.category || product.category;
      product.tags = req.body.tags || product.tags;

      // For booleans, we need to check if the property exists, as it could be false
      if (req.body.isBestSeller !== undefined) {
        product.isBestSeller = req.body.isBestSeller;
      }
      if (req.body.isActive !== undefined) {
        product.isActive = req.body.isActive;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/owner/products/:id
// @access  Private/Owner
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // In Mongoose 6+, remove() is deprecated. Use deleteOne() or deleteMany().
      await product.deleteOne(); 
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};
