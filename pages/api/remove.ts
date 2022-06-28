import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/init'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end()
    }
    const { uuid, code } = req.body
    console.log(uuid, code)
    let room = await prisma.room.findFirst({
        where: {
            code: code
        }
    });

    if (!room) {
        console.log("Room not found");
        res.status(400).json({ status: "Room not found" });
        return;
    }

    let players = room.players;
    let index = players.indexOf(uuid);
    if (index === -1) {
        console.log("User not found in room");
        res.status(400).json({ status: "User not found in room" });
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
    console.log('Room updated, player removed');
    if(players.length === 0) {
        console.log("Room is empty");
    }
    res.status(200).json({
        status: "Removed user from room"
    });
}