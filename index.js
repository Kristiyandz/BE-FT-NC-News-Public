const app = require('./app');
const { PORT } = process.env.DB_URL || require('./config');
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server listening on port ${PORT}`);
});