import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()
type Room = {
    id: string,
    name: string,
    code: string,
    players: Player[]
    createdAt: Date,
    updatedAt: Date,
}
type Player = {
    id: string,
    uuid: string,
    name: string, // no names yet
    Room: Room
    roomId: string
    createdAt: Date,
    updatedAt: Date
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end()
    }
    const { uuid, code } = req.body
    // remove room from player and remove player from room
    let player: Player | null = await prisma.player.findFirst({
        where: {
            uuid: uuid
        }
    })
    let room: Room | null = await prisma.room.findFirst({
        where: {
            code: code
        }
    })

    if (player && room && player.roomId === room.id) {
        room = await prisma.room.update({
            where: {
                id: room.id
            },
            data: {
                players: {
                    disconnect: [{
                        id: player.id
                    }]
                }
            }
        })
        player = await prisma.player.findFirst({
            where: {
                id: player.id
            }
        })
        
        
        console.log("removed");
        res.status(200).end()
        return
    }

    console.log("Failed to remove")
    res.status(400).end()
}