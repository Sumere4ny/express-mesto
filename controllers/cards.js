const Card = require('../models/card');

const getAllCards = (req, res) => Card.find({})
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: err.message }));

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Нет такой карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') return res.status(400).send({ message: err.message });
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Карточка не найдена',
      });
    })
    .catch((error) => res.status(500).send({
      message: `На сервере произошла ошибка: ${error.message}`,
    }));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((result) => {
      if (result) {
        res.send({ data: result });
        return;
      }

      res.status(404).send({
        message: 'Карточка не найдена',
      });
    })
    .catch((error) => res.status(500).send({
      message: `Произошла ошибка: ${error.message}`,
    }));
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  // eslint-disable-next-line comma-dangle
  dislikeCard
};
