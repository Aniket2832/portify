const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const Portfolio = require('../models/Portfolio');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + uuidv4().slice(0, 6);
};

const getAll = async (req, res) => {
  try {
    const portfolios = await Portfolio.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, template } = req.body;
    const portfolio = await Portfolio.create({
      userId: req.user.id,
      title: title || 'My Portfolio',
      slug: generateSlug(title || 'my-portfolio'),
      template: template || 'minimal',
      data: {
        hero: { name: '', tagline: '', bio: '' },
        skills: [],
        projects: [],
        experience: [],
        contact: { email: '', github: '', linkedin: '' },
      },
    });
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    if (req.body.slug && req.body.slug !== portfolio.slug) {
      const clean = req.body.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const existing = await Portfolio.findOne({ where: { slug: clean, id: { [Op.ne]: portfolio.id } } });
      if (existing) return res.status(409).json({ message: 'This URL is already taken' });
      req.body.slug = clean;
    }

    await portfolio.update(req.body);
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    await portfolio.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAll, create, getOne, update, remove };