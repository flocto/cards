import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { getName, getPlayers } from '../../database/db'
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from 'react'

/*
    Currently broken due to DB being stored in a variable
    Just imagine it works with an actual DB for now.
*/
export async function getServerSideProps(context: any) {
  const { code } = context.params
  const name = getName(code)
  const players: string[] = getPlayers(code)
  return {
    props: {
      code,
      name,
      players,
    },
  }
}


export default function Room(props: any) {
  const { code, name, players } = props
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
          <div>
            {player}
          </div>
        ))}
      </main>
    </div>
  )
}