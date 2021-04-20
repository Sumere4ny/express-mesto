const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw createError(401, 'Токен не передан');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (error) {
    throw createError(401, 'Передан некорректный токен');
  }

  req.user = payload;

  next();
};

module.exports = auth;
