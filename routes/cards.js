const cardsRouter = require('express').Router();
const { getAllCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:id', deleteCard);

module.exports = cardsRouter;
