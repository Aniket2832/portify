const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAll, create, getOne, update, remove } = require('../controllers/portfolioController');

router.use(protect); // all portfolio routes are protected

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getOne);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;