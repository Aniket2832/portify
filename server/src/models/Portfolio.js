const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Portfolio = sequelize.define('Portfolio', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false, defaultValue: 'My Portfolio' },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  data: { type: DataTypes.JSONB, defaultValue: {} },
  published: { type: DataTypes.BOOLEAN, defaultValue: false },
  template: { type: DataTypes.STRING, defaultValue: 'minimal' },
  accentColor: { type: DataTypes.STRING, defaultValue: '#6366f1' },
  views: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'portfolios',
  timestamps: true,
});

User.hasMany(Portfolio, { foreignKey: 'userId', onDelete: 'CASCADE' });
Portfolio.belongsTo(User, { foreignKey: 'userId' });

module.exports = Portfolio;