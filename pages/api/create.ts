import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()
type Data = {
    code: string,
    name: string | string[],
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
function generateCode(): string { //random string of length 4
    let code = ''
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let code = generateCode();
    await prisma.room.create({
        data: {
            code: code,
            name: req.body.name,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    })
    res.redirect(307,`/room/${code}`);
}