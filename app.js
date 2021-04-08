const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');

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
app.use((req, res, next) => {
  req.user = {
    _id: '606033e1b622a8139459a7b2',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
});

app.listen(PORT);
