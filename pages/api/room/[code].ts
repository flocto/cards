import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../types/socket";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
   //individual room socket handling, will implement later
   res.end();
};
