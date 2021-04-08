const User = require('../models/user');

const getAllUsers = (req, res) => User.find({})
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: err.message }));

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: 'Произошла ошибка' });
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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: error.message,
        });
        return;
      }

      res.status(500).send({
        message: `Произошла ошибка: ${error.message}`,
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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: error.message,
        });
        return;
      }

      res.status(500).send({
        message: `Произошла ошибка: ${error.message}`,
      });
    });
};

module.exports = {
  createUser, getAllUsers, getUser, updateUser, updateAvatar,
};
