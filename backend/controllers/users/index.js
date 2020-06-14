// const express = require('express');
const User = require('../../moduls/user');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const chatRooms = require('../../moduls/messages');
const { UnsubscriptionError } = require('rxjs');

const createUser = async (req, res) => {
  // upload.single('image');
  const login = req.body.login;
  try {
    let users = await User.find();
    let count = 0;
    users.forEach((user) => {
      if (user.login == login) {
        count++;
      }
    });
    if (count == 0) {
      const body = req.body;
      let user = {
        name: body.name,
        login: body.login,
        password: body.password,
        image: req.file.filename,
      }
      let newUser = new User(user);
      try {
        await newUser.save();
        res.send({
          ok: true,
          message: 'User created'
        })
      } catch (error) {
        console.log(error);
        res.send({
          ok: false,
          message: 'Error in create User'
        })
      }
    } else {
      res.send({
        ok: true,
        message: 'Users not found'
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: 'Error'
    })
  }
}

const login = async (req, res) => {

  let isPresent = false;
  let correctPassword = false;
  let loggedInUser;
  let token;

  try {
    let users = await User.find();
    users.forEach((user) => {
      if ((user.login == req.body.login)) {
        if (user.password == req.body.password) {
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
    res.send({
      ok: true,
      isPresent: isPresent,
      correctPassword: correctPassword,
      user: loggedInUser,
      token: token
    });

  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: 'Users Not found'
    });
  }

}

const users = async (req, res) => {
  try {
    let user = await User.find();
    let token = req.params.token;
    let distoken = jwt.verify(token, 'pro');

    if (user.length > 0) {
      let users = [];
      user.forEach((user) => {
        if (user.login !== distoken.login) {
          user.image = config.URL + '/images/' + user.image;
          users.push(user)
        }
      });
      res.status(200).json(users);
    } else {
      res.status(404).json(false);
    }
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: 'Users not found'
    })
  }

}

const getOne = async (req, res) => {
  const id = req.params.id;
  try {
    const users = await User.findById(id);
    users.image = config.URL + '/images/' + users.image;
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: 'User not found'
    })
  }
}

const getChatRoom = async (req, res) => {
  let room = req.params.room;
  try {
    let msg = await chatRooms.findOne({name: room});
    if (msg.messages.length > 0) {
      res.json({
        msg: msg.messages,
        ok: true
      })
    } else {
      res.send({
        ok: false,
        message: 'Messages not found'
      })
    }
  } catch (error) {
      console.log(error);
      res.send({
        ok: false,
        message: 'Messages not found'
      })

  }
}

const updateUserInform = async (req, res) => {
  let id = req.params.id;
  var body = req.body;

  try {
    const result = await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    res.send({
      ok: true,
      result: result
    })
  } catch (error) {
    console.log(error);
    res.send({
      ok: false,
      message: 'Error in find User in Update Inform'
    })

  }
}

module.exports = {
  createUser,
  login,
  users,
  getOne,
  getChatRoom,
  updateUserInform
}
