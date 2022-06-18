import type { NextApiRequest, NextApiResponse } from 'next'
import {createRoom, addPlayer} from '../../database/db'
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

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let code = generateCode();
    createRoom(code, req.body.name);
    addPlayer(code, req.body.uuid);
    res.redirect(`/room/${code}`);
}