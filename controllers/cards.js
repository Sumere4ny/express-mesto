const Card = require('../models/card');

const getAllCards = (req, res) => Card.find({})
  .then((user) => res.send({ data: user }))
  .catch((err) => res.status(500).send({ message: err.message }));

const deleteCard = (req, res, next) => Card.findById(req.params.id)
  .then((card) => {
    if (!card) {
      throw new Error('Карточка не найдена');
    }
    if (JSON.stringify(card.owner) === JSON.stringify(req.user._id)) {
      return Card.findByIdAndRemove(req.params.id).then((data) => res.send(data));
    }
    const err = new Error('Вы не можете удалить карточку другого пользователя');
    err.statusCode = 403;
    return next(err);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      const error = new Error('Карточка не найдена');
      error.statusCode = 404;
      return next(error);
    }
    return next(err);
  });

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
  dislikeCard,
};
