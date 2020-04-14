const express = require('express');
const chatRooms = require('../moduls/messages');
const router = express.Router();

router.get('/chatroom/:room', async (req, res, next) => {
  let room = req.params.room;
  const chats = await chatRooms.find({name: room});
  res.status(200).json(chats[0].messages);
});



module.exports = router
