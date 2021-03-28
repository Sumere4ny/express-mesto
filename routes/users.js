const usersRouter = require('express').Router();
const { createUser, getAllUsers, getUser } = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUser);
usersRouter.post('/', createUser);

module.exports = usersRouter;
