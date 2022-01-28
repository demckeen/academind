const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const PATH = process.env.PORT || 3000;

const MONGODB_URL = 'mongodb+srv://zircadia:jojojojo12@udemy.lmppa.mongodb.net/shop?retryWrites=true&w=majority';

const errorController = require('./controllers/error');
const User = require('./models/user');

const corsOptions = {
  origin: "https://nodemaxmongoose.herokuapp.com/",
  optionsSuccessStatus: 200
};

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  family: 4
};

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('61f466400c60c434e8620f0b')
    .then(user => {
      req.user = user;
      next();
    }) 
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    MONGODB_URL, options
  )
  .then(result => {
    User.findOne().then(user => {
      if(!user) {
        const user = new User({
        username: 'zircadia',
        email: 'test@email.com',
        cart: {
        items: []
      }
    });
    user.save();}});
    app.listen(PATH);
  })
  .catch(err => {
    console.log(err);
  });
