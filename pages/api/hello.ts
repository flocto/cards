import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/socket";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { Socket } from "socket.io-client";

//testing api

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  res.end();
};
