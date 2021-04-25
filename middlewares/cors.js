const cors = require('cors');

const whiteList = ['http://sumere4ny.students.nomoredomains.icu', 'https://sumere4ny.students.nomoredomains.icu', 'http://localhost:3000'];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

module.exports = cors(corsOptions);
