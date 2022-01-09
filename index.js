const { createServer } = require("http");
const express = require("express");

const { SocketEvents } = require("./event");
const { MemCache }  = require("./memCache");

require("dotenv").config();


(async () => {
  const PORT = process.env.PORT || 6000;
  const app = express();

  const httpServer = createServer(app);

  const io = require("socket.io")(httpServer);
  io.listen(PORT, {
    transports: ["websocket", "polling"],
  });

  const nsp = io.of("/chat");
  nsp.use(async (socket, next) => {
    const token = socket.handshake.query.id;
    if (token) {
      socket.user = {};
      socket.user.id = token;
      next();
    }
  }).on('connection', (socket) => {
    console.log('connected');
    MemCache.hset(process.env.CHAT_SOCKET, socket.user.id, socket.id);
    const socketEvents = new SocketEvents();
    socketEvents.init(nsp, socket);
  })
})();
