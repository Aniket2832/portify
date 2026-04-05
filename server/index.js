const app = require('./src/app');
const sequelize = require('./src/config/db');
require('./src/models/User');
require('./src/models/Portfolio');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Supabase PostgreSQL connected');
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    // Keep Render alive - ping every 14 minutes
setInterval(async () => {
  try {
    await fetch('https://portify-api.onrender.com/health')
    console.log('🏓 Keep-alive ping sent')
  } catch (err) {
    console.log('Ping failed:', err.message)
  }
}, 14 * 60 * 1000)
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1);
  }
})();