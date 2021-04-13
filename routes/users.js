const usersRouter = require('express').Router();
const {
  getAllUsers, getCurrentUser, updateUser, updateAvatar, getUserById,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:id', getUserById);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
