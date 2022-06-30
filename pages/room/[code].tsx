import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { v4 as uuidv4 } from 'uuid'
import { getCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { Socket, io } from 'socket.io-client'
import { prisma } from '../../prisma/init'


export async function getServerSideProps(context: any) {
  const { code } = context.params
  const room = await prisma.room.findFirst({
    where: {
      code: code
    }
  });
  if (!room) {
    return {
      props: {
        error: true,
        errorMsg: 'Room not found'
      }
    }
  }
  const name = room.name;
  let uuids = room.players;
  const cookies = getCookies(context)
  if (!cookies.id) {
    setCookies("id", uuidv4(), context)
  }
  const uuid = cookies.id

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
  const [name, setName] = useState<string>(props.name)
  const [uuids, setUuids] = useState<string[]>(props.uuids)
  const latestUuids = useRef<string[]>(uuids)
  const [code, setCode] = useState<string>(props.code)
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false)

  function socketSetup() { // socket logic
    socket = io('', { path: '/api/room' })

    socket.on("connect", () => {
      setIsSocketConnected(true)
      // console.log("SOCKET CONNECTED!", socket.id);
      socket.emit('join-room', {
        code: code,
        uuid: props.uuid,
      });
    });

    socket.on('user-join', (data: string) => {
      // console.log("USER JOINED!", data);
      let temp = [...latestUuids.current];
      let index = temp.indexOf(data)
      if (index === -1) {
        temp.push(data)
      }
      setUuids(uuids => {
        latestUuids.current = temp;
        return [...temp];
      });
    });

    socket.on('user-leave', (data: string) => {
      // console.log("USER LEFT!", data);
      setUuids(uuids => {
        let temp = [...uuids].filter((u: string) => u !== data);
        latestUuids.current = temp
        return temp
      })
      console.log(uuids);
    });
  }

  useEffect(() => { 
    if (props.error) { // no need to connect 
      return
    }

    socketSetup();
    if (socket) return () => {
      socket.disconnect();
    }
  }, [])

  if (!props.data && props.error) { // unused
    return <div>{props.errorMsg}</div>
  }
  if (!isSocketConnected) {
    return <div>Loading...</div>
  }
  //console.log("uuids", uuids)
  let players = latestUuids.current;
  return (
    <div className={styles.container}>
      <Head>
        <title>Room: {name}</title>
        <meta name="description" content="Card game room" />
      </Head>
      <main className={styles.main}>
        <h1>Room is called {name}</h1>
        <h1>Room code is {code}</h1>
        <h1>Players are:</h1>
        {players.map((player: string) => (
          <p key={player}>{player}</p>
        ))}
      </main>
    </div>
  )
}