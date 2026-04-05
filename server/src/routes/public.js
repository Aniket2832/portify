const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// GET /api/public/:slug — fetch published portfolio + increment views
router.get('/:slug', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      where: { slug: req.params.slug, published: true }
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found or not published' });

    // Increment view count
    await portfolio.increment('views');

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;