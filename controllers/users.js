const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');

const JWT_SECRET = 'some-secret-key';

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!email || !password) {
    throw createError(400, 'Email и пароль не должны быть пустыми');
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw createError(409, 'Пользователь с таким email существует');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email, password: hash, name, about, avatar,
        }))
        .then((data) => res.status(200).send({ data }))
        .catch((err) => {
          if (err.name === 'ValidationError' || err.name === 'CastError') {
            throw createError(400, 'Некорректные данные пользователя');
          }
          return next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createError(400, 'Email и пароль не должны быть пустыми');
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw createError(400, 'Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw createError(400, 'Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
              sameSite: true,
            })
            .status(200).send({ message: 'Авторизация успешна (токен в куках)!' });
        });
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw createError(404, 'Пользователя с таким id не существует');
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw createError(400, 'Переданы некорректные данные');
      }
      res.send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports = {
  createUser, getAllUsers, getUserById, updateUser, updateAvatar, login, getCurrentUser, JWT_SECRET,
};
