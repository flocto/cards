import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/socket";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { Socket } from "socket.io-client";

//socket testing

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server created");

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/hello",
    });

    io.on("connect", (socket) => {
      console.log("New client connected");
      socket.on("update-input", (msg) => {
        io.emit("update-input", msg);
      });
      socket.on('disconnect', function(){
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  else{
    console.log("Socket.io server already exists");
  }
  res.end();
};
