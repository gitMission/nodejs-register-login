const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();

//import user model
const User = require('./models/User');

mongoose.Promise = global.Promise;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  'mongodb+srv://margaren1103:margaren1103@cluster0-7nu2l.mongodb.net/login?retryWrites=true&w=majority',
  { useNewUrlParser: true },
  () => {
    console.log('DB connected');
  }
);

app.post('/register', (req, res) => {
  const newUser = new User();

  newUser.email = req.body.email;
  newUser.password = req.body.password;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) return err;
      newUser.password = hash;
      newUser
        .save()
        .then(userSaved => {
          res.send('USER SAVED');
        })
        .catch(err => {
          res.send('User was not save' + err);
        });
    });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      bcrypt.compare(req.body.password, user.password, (err, matched) => {
        if (err) return err;
        if (matched) {
          res.send('USER WAS ABLE TO LOGIN');
        } else {
          res.send('NOT ABLE TO LOGIN');
        }
      });
    }
  });
});

app.listen(3000, () => {
  console.log('Server start on port 3000');
});
