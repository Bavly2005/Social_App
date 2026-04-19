import { Server } from "socket.io";
import { sendMessage } from "./chatting/chat.services.js";
import socketAuth from "./middleware/authentication.socket.js";

export const runSocket = function (server) {
  const io = new Server(server, { cors: { origin: "*" } });
  io.use(socketAuth);

  io.on("connection", (socket) => {
    socket.on("sendMessage", sendMessage(socket, io));
  });

  return io;
};
