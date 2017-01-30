const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 8000;
const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})
app.listen(PORT, () => console.log('Server running on port', PORT));