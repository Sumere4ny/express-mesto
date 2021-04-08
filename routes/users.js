const usersRouter = require('express').Router();
const {
  createUser, getAllUsers, getUser, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUser);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
