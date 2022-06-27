import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid'
import { getCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { prisma } from '../../prisma/init'
import type { Room, Player } from '../../prisma/init'


export async function getServerSideProps(context: any) {
  // this is annoying, idk if it works or not
  // if(context.req.url.startsWith('/_next/data/')) {
  //   return {
  //     props: {
  //       data: null,
  //       error: true,
  //       errorMsg: "No double render"
  //     }
  //   }
  // }

  const { code } = context.params
  let room: Room | null = await prisma.room.findFirst({
    where: {
      code: code
    },
    include: {
      players: true
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
  let player = await prisma.player.create({
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
  room = await prisma.room.update({
    where: {
      id: room.id
    },
    data: {
      playerCount: room.playerCount + 1
    }
  })

  // console.log(room);
  // await prisma.room.update({
  //   where: {
  //     id: room.id
  //   },
  //   data: {
  //     players: {
  //       connect: {
  //         id: player.id
  //       }
  //     },
  //     updatedAt: new Date()
  //   }
  // })


  let players: Player[] | undefined = room.players;
  players = await prisma.room.findFirst({
    where: {
      id: room.id
    },
    include: {
      players: true
    }
  }).then((room: any) => room.players);
  if (!players) {
    players = []
  }
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

var hackyDoubleUnload = false; // somehow this works :)
export default function Room(props: any) {
  const [name, setName] = useState(props.name)
  const [uuids, setUuids] = useState(props.uuids)
  const [code, setCode] = useState(props.code)
  const router = useRouter()

  useEffect(() => {
  }, [uuids]) //none of this does anything yet

  useEffect(() => {
    const handleUnload = async (e: BeforeUnloadEvent) => {
      if (hackyDoubleUnload) { // sometimes function is called twice
        return;
      }
      hackyDoubleUnload = true;

      // if (uuids.length === 1) {
      //   e.preventDefault();
      //   e.returnValue = "Are you sure you want to leave?\nThe room will be deleted.";
      // }

      // clearing player info on unload
      // post to /api/remove with uuid and code
      const uuid = getCookies().id;

      await fetch(`/api/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: uuid,
          code: code
        })
      }).then(async res => {
        console.log(await res.text())
      })
    }
    if (typeof window !== 'undefined' && !props.error) {
      window.addEventListener('beforeunload', handleUnload);
    }
  }, [])

  if (!props.data && props.error) {
    return <div>{props.errorMsg}</div>
  }
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