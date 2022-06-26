// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/init'
import type { Room, Player } from '../../prisma/init'

// prisma testing, will be removed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await prisma.room.create({
    data: {
      name: 'testroom2 (random)',
      code: 'BBBB',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })
  const data = await prisma.room.findFirst({});
  await prisma.room.deleteMany({ // delete only accepts id, deleteMany accepts other options
    where: {
      code: 'BBBB'
    }
  })

  res.status(200).json(data);
}
