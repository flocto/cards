import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/init'
import type { Room, Player } from '../../prisma/init'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // if (false === true){
    //     res.status(418).json({
    //         message: 'I\'m a teapot'
    //     })
    //     return
    // }
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

    if (!player || !room) {
        res.status(400).json({
            error: 'Player or room not found'
        })
        return
    }
    if (player.roomId == null) {
        res.status(400).json({
            error: 'Player is already disconnected'
        })
        return
    }
    if (player.roomId !== room.id) {
        res.status(400).json({
            error: 'Player is not in this room'
        })
        return
    }

    await prisma.player.delete({
        where: {
            id: player.id
        }
    })
    await prisma.room.update({
        where: {
            id: room.id
        },
        data: {
            players: {
                disconnect: {
                    id: player.id
                }
            },
            updatedAt: new Date()
        }
    })
    

    console.log("Deleted player and removed player from room")
    res.status(200).json({
        message: 'Player disconnected'
    })
}