const usersRouter = require('express').Router();
const {
  getUserByIdValidation,
  updateUserProfileValidation,
  updateUserAvatarValidation,
} = require('../middlewares/validation');
const {
  getAllUsers, getCurrentUser, updateUser, updateAvatar, getUserById,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:id', getUserByIdValidation, getUserById);
usersRouter.patch('/me', updateUserProfileValidation, updateUser);
usersRouter.patch('/me/avatar', updateUserAvatarValidation, updateAvatar);

module.exports = usersRouter;
