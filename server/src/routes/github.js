const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/:username', protect, async (req, res) => {
  try {
    const { username } = req.params;
    const response = await fetch(
      'https://api.github.com/users/' + username + '/repos?sort=updated&per_page=30',
      { headers: { 'User-Agent': 'Portify-App', Accept: 'application/vnd.github.v3+json' } }
    );

    if (!response.ok) {
      if (response.status === 404) return res.status(404).json({ message: 'GitHub user not found' });
      return res.status(400).json({ message: 'Failed to fetch repos' });
    }

    const repos = await response.json();

    const mapped = repos
      .filter(r => !r.fork)
      .map(r => ({
        name: r.name,
        desc: r.description || '',
        url: r.html_url,
        tech: r.language || '',
        stars: r.stargazers_count,
        updated: r.updated_at,
      }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;