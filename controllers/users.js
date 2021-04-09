const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = 'some-secret-key';

const getAllUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
}


const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  if (!email || !password) {
    const err = new Error('Некорректные данные пользователя');
    err.statusCode = 400;
    return next(err);
  }

  return User.findOne({ email }).then((user) => {
    if (user) {
      const err = new Error('Пользователь уже зарегистрирован');
      err.statusCode = 409;
      return next(err);
    }
    return bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name, about, avatar,
      }))
      .then((data) => {
        res.send({
          email: data.email,
          name: data.name,
          about: data.about,
          avatar: data.avatar,
          _id: data._id,
        });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          const error = new ValidationError('Некорректные данные пользователя');
          return next(error);
        }
        return next(err);
      });
  })
    .catch(next);
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
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
    .then((result) => res.send({ data: result }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }

      res.status(500).send({
        message: `Произошла ошибка: ${err.message}`,
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    })
    .then((result) => res.send({ data: result }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }

      res.status(500).send({
        message: `Произошла ошибка: ${err.message}`,
      });
    });
};

module.exports = { createUser, getAllUsers, getUser, updateUser, updateAvatar, login, getCurrentUser, JWT_SECRET };
