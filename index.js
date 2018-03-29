const app = require('./app');
const PORT = process.env.PORT || require('./config')[process.env.NODE_ENV].PORT;
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server listening on port ${PORT}`);
});