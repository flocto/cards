import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import Router from "next/router";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Card } from '../components/card'
import { Deck } from '../components/deck'

const suits: string[] = ['S', 'H', 'D', 'C']
const values: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const deck: JSX.Element[] = []
for (const suit of suits) {
  for (const value of values) {
    deck.push(<Card suit={suit} value={value}></Card>)
  }
}

const randomIndex = () => {
  const index = Math.floor(Math.random() * deck.length)
  return index;
}

export const getStaticProps = async () => {
  const index = randomIndex()
  return {
    props: {
      card: index
    }
  }
}

const Home: NextPage = (props: any) => {
  const [card, setCard] = useState(props.card)
  
  function getNewCard() {
    const index = randomIndex()
    setCard(index)
  }

  useEffect(() => {
  }, [card])

  return (
    <div className={styles.container}>
      <Head>
        <title>Cards</title>
        <meta name="description" content="Cards?!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* {deck[card]}
        <button onClick={getNewCard}>New Card</button> */}
        <Deck shuffled={true} bigJoker={true} smallJoker={true}></Deck>
      </main>
    </div>
  )
}

export default Home
