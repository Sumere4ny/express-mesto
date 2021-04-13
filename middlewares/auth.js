const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { JWT_SECRET } = require('../controllers/users.js');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw createError(401, 'Токен не передан');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw createError(401, 'Передан некорректный токен');
  }

  req.user = payload;

  next();
};

module.exports = auth;
