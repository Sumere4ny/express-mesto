const usersRouter = require('express').Router();
const {
  getAllUsers, getCurrentUser, updateUser, updateAvatar, getUserById
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
