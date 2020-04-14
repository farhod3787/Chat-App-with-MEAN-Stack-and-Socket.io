const express = require('express');
const User = require('../moduls/user');
const jwt = require('jsonwebtoken');
const chatRooms = require('../moduls/messages');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Welcome to the express server...');
});

router.post('/users', (req, res, next) => {
  let user = {
      name: req.body.name,
      login: req.body.login,
      password: req.body.password
  };
  let use = new User(user);
  use.save().then( result => {
    res.json(result)
  })

});

router.post('/login', async (req, res) => {
  let isPresent = false;
  let correctPassword = false;
  let loggedInUser;
  let token;

  let users = await User.find();
  users.forEach((user) => {
    if((user.login == req.body.login)) {
        if(user.password == req.body.password) {
            isPresent = true;
            correctPassword = true;
            loggedInUser = {
                username: user.name
            }
            let value = {
              login: req.body.login,
              password: req.body.password
            }
            token = jwt.sign(value, 'pro')
        } else {
            isPresent = true;
        }
    }
});
res.json({ isPresent: isPresent, correctPassword: correctPassword, user: loggedInUser, token: token });
});

router.get('/users', async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});


router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const users = await User.findById(id);
  res.status(200).json(users);
});


router.get('/chatroom/:room', (req, res, next) => {
  let room = req.params.room;
  chatRooms.find({name: room}).toArray((err, chatroom) => {
      if(err) {
          console.log(err);
          return false;
      }
      res.json(chatroom[0].messages);
  });
});



module.exports = router
