import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid'
import { getCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { PrismaClient } from '@prisma/client'

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
  Room?: Room
  roomId?: string
  createdAt: Date,
  updatedAt: Date
}

const prisma = new PrismaClient();
export async function getServerSideProps(context: any) {
  if(context.req.url.startsWith('/_next/data/')) {
    return {
      props: {
        data: null,
        error: true,
        errorMsg: "No double render"
      }
    }
  }

  const { code } = context.params
  let room: Room = await prisma.room.findFirst({
    where: {
      code: code
    }
  })
  if (!room) {
    return {
      props: {
        data: null,
        error: true,
        errorMsg: 'Room not found'
      }
    }
  }

  let name = room.name;

  const cookies = getCookies(context)
  if (!cookies.id) {
    setCookies("id", uuidv4(), context)
  }
  let uuid = cookies.id
  let player = await prisma.player.findFirst({
    where: {
      uuid: uuid
    }
  })
  if (!player) {
    // create player if not exists
    player = await prisma.player.create({
      data: {
        uuid: uuid,
        name: "",
        Room: {
          connect: {
            id: room.id
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  // add player to room
  if (!player.roomId) {
    await prisma.player.update({
      where: {
        id: player.id
      },
      data: {
        Room: {
          connect: {
            id: room.id
          }
        },
      }
    })
    await prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        players: {
          connect: {
            id: player.id
          }
        }
      }
    })
  }

  let players: Player[] = room.players;
  players = await prisma.room.findFirst({
    where: {
      id: room.id
    },
    include: {
      players: true
    }
  }).then((room: Room) => room.players);
  const uuids = players.map(p => p.uuid)

  // console.log(code)
  // console.log(name)
  // console.log(uuids)

  return {
    props: {
      code,
      name,
      uuids,
    },
  }
}


export default function Room(props: any) {
  if(!props.data && props.error) {
    return <div>{props.errorMsg}</div>
  }
  const [name, setName] = useState(props.name)
  const [uuids, setUuids] = useState(props.uuids)
  const [code, setCode] = useState(props.code)
  const router = useRouter()

  useEffect(() => {
  }, [uuids]) //none of this does anything yet

  useEffect(() => {
    const handleUnload = async (e: BeforeUnloadEvent) => {
      // clearing player info on unload
      const uuid = getCookies().id;
      // post to /api/remove with uuid and code
      await fetch(`/api/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: uuid,
          code: code
        })
      })
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleUnload);
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Room: {name}</title>
        <meta name="description" content="Room" />
      </Head>
      <main className={styles.main}>
        <h1>Room is called {name}</h1>
        <h1>Room code is {code}</h1>
        <h1>Players are:</h1>
        {uuids.map((player: string) => (
          <p key={player}>{player}</p>
        ))}
      </main>
    </div>
  )
}