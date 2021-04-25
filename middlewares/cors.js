const cors = require('cors');

const whiteList = ['http://sumere4ny.students.nomoredomains.icu', 'https://sumere4ny.students.nomoredomains.icu'];

const corsOptions = {
  origin(origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('not allowd by CORS'));
    }
  },
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

module.exports = cors(corsOptions);
