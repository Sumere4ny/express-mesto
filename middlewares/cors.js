const cors = require('cors');

const options = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(options);
