const express = require('express');
const router = express.Router();
const featuredController = require('../controllers/featuredController');

// import your owner middleware
const { protect, owner } = require('../middleware/ownerAuth');

// Public - view featured products
router.get('/', featuredController.getFeatured);

// Admin/Owner only
router.post('/', [protect, owner], featuredController.addFeatured);
router.put('/:id', [protect, owner], featuredController.updateFeatured);
router.delete('/:id', [protect, owner], featuredController.deleteFeatured);

module.exports = router;
