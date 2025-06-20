const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
} = require('../controllers/whishlist.controller');

// Get student's wishlist
router.get('/students/:studentId/wishlist', getWishlist);

// Add to wishlist
router.post('/students/:studentId/wishlist', addToWishlist);

// Remove from wishlist
router.delete('/wishlist/:id', removeFromWishlist);

// Clear wishlist
router.delete('/students/:studentId/wishlist', clearWishlist);

module.exports = router;