// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

const prisma: PrismaClient = new PrismaClient()


// prisma testing, will be removed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
