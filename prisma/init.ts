import { PrismaClient } from '@prisma/client'
type Room = {
    id: string,
    name: string,
    code: string,
    players?: Player[]
    createdAt: Date,
    updatedAt: Date,
}
type Player = {
    id: string,
    uuid: string,
    name: string, // no names yet
    Room?: Room
    roomId: string | null
    createdAt: Date,
    updatedAt: Date
}

declare global {
    var prisma: PrismaClient
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
}
// `stg` or `dev`
else {
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }

    prisma = global.prisma
}

export { prisma }
export type { Room, Player }