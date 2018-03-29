const app = require('./app');
const { PORT } = process.env || require('./config');
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server listening on port ${PORT}`);
});