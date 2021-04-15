const CreateError = require('http-errors');
const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const deleteCard = (req, res, next) => Card.findById(req.params.id)
  .then((card) => {
    if (!card) {
      throw new CreateError(404, 'Карточка не найдена');
    }
    if (JSON.stringify(card.owner) === JSON.stringify(req.user._id)) {
      return Card.findByIdAndRemove(req.params.id).then((data) => res.send(data));
    }
    throw CreateError(403, 'Вы не можете удалить карточку другого пользователя');
  })
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((card) => {
      if (!card) {
        throw CreateError(404, 'Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    })
    .then((card) => {
      if (!card) {
        throw CreateError(404, 'Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
