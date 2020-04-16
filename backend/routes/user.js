const express = require('express');
const User = require('../moduls/user');
const jwt = require('jsonwebtoken');
const chatRooms = require('../moduls/messages');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Errorrr");
      if (isValid) {
          error = null;
      }
      cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('-');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post('/', async (req, res, next) => {
 const login = req.body.login;
 let users = await User.find();
 let count = 0;
 users.forEach( (user) => {
    if ( user.login == login) {
      count++;
    }
 });
 console.log(count);
 if (count == 0) {
  let use = new User(req.body);
  use.save().then( result => {
    res.json(result)
  })
} else {
  res.json(false)
}
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
                username: user.name,
                userId: user._id,
                login: user.login
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

router.get('/users/:token', async (req, res, next) => {
  let token = req.params.token;
  let distoken = jwt.verify(token, 'pro');
  let user = await User.find();
  let users = [];
  user.forEach( (user) => {
    if (user.login !== distoken.login) {
      users.push(user)
    }
  });
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

router.patch('/:id', async (req, res, next) =>{
  let id = req.params.id;
  var body = req.body;
  await User.findByIdAndUpdate(id,{ $set: body }, { new: true } ).then( result => {
    if ( result) {
        res.status(200).json(true)
    } else {
      res.status(400).json(false)
    }
  }).catch ( err => {
    console.log(err);
    res.status(400).json(false)
  })
})

module.exports = router
