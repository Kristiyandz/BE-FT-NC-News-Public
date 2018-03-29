const app = require('./app');
const PORT = process.env.PORT || require('./config/index').PORT
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server listening on port ${PORT}`);
});