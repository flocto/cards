import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid'
import { getCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { prisma } from '../../prisma/init'
import type { Room } from '@/types/prisma'
import { Socket, io } from 'socket.io-client'
import { stdout } from 'process'


export async function getServerSideProps(context: any) {
  const { code } = context.params
  let room: Room | null = await prisma.room.findFirst({
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


  //console.log(room);
  if (!room.players.includes(uuid)) {
    room = await prisma.room.update({
      where: {
        id: room.id
      },
      data: {
        players: {
          push: uuid
        },
        updatedAt: new Date()
      }
    })
  }

  const uuids: String[] = room.players;

  // console.log(code)
  // console.log(name)
  // console.log(uuids, uuid)

  return {
    props: {
      code,
      name,
      uuid,
      uuids,
    },
  }
}

let socket: Socket;
export default function Room(props: any) {
  const [name, setName] = useState(props.name)
  const [uuids, setUuids] = useState(props.uuids)
  const [code, setCode] = useState(props.code)
  const router = useRouter()

  useEffect(() => {
    if (props.error) { // no need to connect 
      return
    }
    socket = io('', { path: '/api/room' })

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      socket.emit('join-room', {
        code: code,
        uuid: props.uuid,
      });
    });

    //update player list
    socket.on('user-join', data => {
      console.log("USER JOINED!", data);
      let index = uuids.indexOf(data)
      if (index === -1) {
        setUuids([...uuids, data])
      }
    });

    socket.on('user-leave', data => {
      setUuids(uuids.filter((u: string) => u !== data))
    });

    if (socket) return () => {
      socket.disconnect();
    }
  }, [])

  if (!props.data && props.error) {
    return <div>{props.errorMsg}</div>
  }
  //console.log("uuids", uuids)
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