const chatRooms = require('../../moduls/messages');

const getMessage = async (req, res) => {
  let room = req.params.room;
  try {
    const chats = await chatRooms.find({name: room});
    res.status(200).json(chats[0].messages);
  } catch (error) {
      console.log(error);
      res.status(400).json(false)
  }
}

module.exports = {
  getMessage
}
