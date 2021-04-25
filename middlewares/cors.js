const cors = require('cors');

const whiteList = ['http://sumere4ny.students.nomoredomains.icu', 'https://sumere4ny.students.nomoredomains.icu'];

const corsOptions = {
  origin: whiteList,
  methods: ['GET', 'PUT', 'PATCH', 'DELETE', 'POST'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

module.exports = cors(corsOptions);
