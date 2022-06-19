import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { createRoom, deleteRoom, addPlayer, removePlayer, getName, getPlayers } from '../../database/db'
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { getCookies, setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

/*
    Currently broken due to DB being stored in a variable
    Just imagine it works with an actual DB for now.
*/
export async function getServerSideProps(context: any) {
  const cookies = getCookies(context)
  if (!cookies.id) {
    setCookies("id", uuidv4(), context)
  }
  let id = cookies.id

  const { code } = context.params
  let name = getName(code)
  if (name === null) {
    createRoom(code, context.query.name)
    addPlayer(code, id)
    name = context.query.name
  }

  let players = getPlayers(code)
  if (players !== null && !players.includes(id)) {
    addPlayer(code, id)
  }

  return {
    props: {
      code,
      name,
      players,
    },
  }
}


export default function Room(props: any) {
  const [name, setName] = useState(props.name)
  const [players, setPlayers] = useState(props.players)
  const [code, setCode] = useState(props.code)
  useEffect(() => {
  }, [players]) //none of this does anything yet

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
        {players.map((player: string) => (
          <p key={player}>{player}</p>
        ))}
      </main>
    </div>
  )
}