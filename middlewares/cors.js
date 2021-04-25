const cors = require('cors');

const options = {
  origin: ['http://sumere4ny.students.nomoredomains.icu', 'https://sumere4ny.students.nomoredomains.icu'],
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(options);
