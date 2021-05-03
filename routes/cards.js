const cardsRouter = require('express').Router();
const {
  createCardValidation,
  deleteCardValidation,
  changeCardLikeStatus,
} = require('../middlewares/validation');
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.delete('/:cardId', deleteCardValidation, deleteCard);
cardsRouter.put('/:cardId/likes', changeCardLikeStatus, likeCard);
cardsRouter.delete('/:cardId/likes', changeCardLikeStatus, dislikeCard);

module.exports = cardsRouter;
