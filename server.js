const http = require('http')
const debug = require('debug')('node-angular')
const app = require('./backend/app');
const chatRooms = require('./backend/moduls/messages');

const socket = require('socket.io');

const path = require("path")

const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;

    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privilegas");
            process.exit(1);
        case "EADDRINUSE":
            console.error(bind + " is already  in use");
            process.exit(1);
            break;
        default:
            throw error;
    }

}

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
    debug("Listening on " + bind);
}


// const port = normalizePort(process.env.Port || 5000)

var port = process.env.PORT || 5000;

app.set('port', port);

const server = http.createServer(app);

// var io = socketIO(server);
// require('./backend/utils/socket')(io);

server.on("error", onError);
server.on("listening", onListening);


server.listen(port, () => { console.log("Running...") });

let users;
let count;
// let chatRooms;

const io = socket.listen(server);

io.sockets.on('connection', (socket) => {
  socket.on('join', async (data) => {
      socket.join(data.room);
      const chats = await chatRooms.find({name: data.room});
      if (chats.length === 0) {
          let room = {
            name : data.room,
            messages: [],
            from: data.user
          };
          let chat = new chatRooms(room);
          chat.save().then( result => {
          });
      }
  });
  socket.on('message', (data) => {
      io.in(data.room).emit('new message', {user: data.user, message: data.message});
      chatRooms.update({name: data.room}, { $push: { messages: { user: data.user, message: data.message } } }, (err, res) => {
          if(err) {
              console.log(err);
              return false;
          }
          console.log("Document updated");
      });
  });
  socket.on('typing', (data) => {
      socket.broadcast.in(data.room).emit('typing', {data: data, isTyping: true});
  });
});
