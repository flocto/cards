import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../../types/socket";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { prisma } from '../../../prisma/init'
//socket testing

export const config = {
    api: {
        bodyParser: false,
    },
};

let clientIdMap: { [key: string]: string } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        console.log("New Socket.io server created");

        const httpServer: NetServer = res.socket.server as any;
        const io = new ServerIO(httpServer, {
            path: "/api/room",
        });
        io.on("connect", (socket) => {
            console.log("New client connected");
            socket.on("join-room", (msg) => {
                io.to(msg.code).emit("user-join", msg.uuid);
                socket.join(msg.code);
                clientIdMap[socket.id] = msg.uuid;
            });
            socket.on("disconnecting", () => {
                console.log('Client disconnecting, will remove');
                //make sure other users are notified of disconnection
                socket.rooms.forEach(async room => {
                    if (room === socket.id) {
                        return;
                    }
                    io.to(room).emit("user-leave", clientIdMap[socket.id]);
                    console.log('User left room', clientIdMap[socket.id], room);
                    //remove user from room in DB
                    await handleRemove(clientIdMap[socket.id], room);
                });
                delete clientIdMap[socket.id];
            });
            socket.on('disconnect', function () {
                console.log('Client disconnected');
            });
        });

        res.socket.server.io = io;
    }
    else {
        console.log("Socket.io server already exists");
    }
    res.end();
};
async function handleRemove(uuid: string, code: string) {
    let room = await prisma.room.findFirst({
        where: {
            code: code
        }
    });

    if (!room) {
        console.log("Room not found");
        return;
    }

    let players = room.players;
    let index = players.indexOf(uuid);
    if (index === -1) {
        console.log("User not found in room");
        return;
    }
    players.splice(index, 1);
    room = await prisma.room.update({
        where: {
            id: room.id
        },
        data: {
            players: {
                set: players
            },
            updatedAt: new Date()
        }
    });
    console.log("removefunction", players);
    console.log('Room updated, player removed');
    if (players.length === 0) {
        console.log("Room is empty");
    }
}