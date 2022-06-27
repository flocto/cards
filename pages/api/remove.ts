import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/init'
import type { Room, Player } from '../../prisma/init'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end()
    }
    const { uuid, code } = req.body
    console.log(uuid, code)
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

    if (!player) {
        console.log('player not found')
        res.status(400).json({
            error: 'Player not found'
        })
        return
    }
    if (!room) {
        console.log('room not found')
        res.status(400).json({
            error: 'Room not found'
        })
        return
    }
    if (player.roomId == null) {
        console.log('player is already disconnected')
        res.status(400).json({
            error: 'Player is already disconnected'
        })
        return
    }
    if (player.roomId !== room.id) {
        console.log('player is not in this room')
        res.status(400).json({
            error: 'Player is not in this room'
        })
        return
    }
    await prisma.player.deleteMany({
        where: {
            uuid: uuid,
            roomId: room.id
        }
    })
    console.log('player removed')

    let players = await prisma.player.findMany({
        where: {
            roomId: room.id
        }
    })
    if (players.length === 0) {
        await prisma.room.delete({
            where: {
                id: room.id
            }
        })
        console.log('room deleted')
    }

    console.log("deleted player and removed player from room")
    res.status(200).json({
        message: 'Player disconnected'
    })
}