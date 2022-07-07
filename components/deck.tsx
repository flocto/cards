import React, { useState, useEffect } from 'react'
import styles from '../styles/Deck.module.css'
import { Card } from './card'

type DeckProps = {
    shuffled: boolean,
    bigJoker: boolean,
    smallJoker: boolean
}

const base: string[] = []
const suits: string[] = ['S', 'H', 'D', 'C']
const values: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const deck: JSX.Element[] = []
for (const suit of suits) {
    for (const value of values) {
        deck.push(<Card suit={suit} value={value} key={value + " of " + suit}></Card>)
    }
}
for (const i in deck) {
    base.push(i)
}

export function Deck({ shuffled, bigJoker, smallJoker }: DeckProps) {
    const [indexes, setDeck] = useState<string[]>(base);

    function shuffle() {
        let temp = [...indexes];
        temp.sort(() => Math.random() - 0.5);
        setDeck(temp);
    }

    function reset() {
        setDeck(base);
    }

    useEffect(() => {
        if (shuffled) {
            shuffle();
        }
    }, []);

    useEffect(() => {
        document.getElementById("shuffle_button")?.scrollIntoView();
    }, [indexes]);

    return (
        <div className={styles.deck}>
            {indexes.map(index => {
                const i = parseInt(index);
                return deck[i];
            })}
            {bigJoker && <Card suit="J" value="J"></Card>}
            {smallJoker && <Card suit="J" value="j"></Card>}
            <button onClick={shuffle} id="shuffle_button">Shuffle</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}