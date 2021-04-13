const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth.js');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const { createUser, login } = require('./controllers/users');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

app.use('/signin', login);
app.use('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/*', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
});

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message
    });
});

app.listen(PORT);
