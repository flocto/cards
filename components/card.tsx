import React, { useState, useEffect } from 'react'
import styles from '../styles/Card.module.css'


type Dictionary = { [index: string]: string }
type CardProps = {
    suit: string,
    value: string
}

let classes = [styles.card]
const Suits: Dictionary = { 'S': String.fromCharCode(0x2660), 'H': String.fromCharCode(0x2665), 'D': String.fromCharCode(0x2666), 'C': String.fromCharCode(0x2663) }
export function Card({ suit, value }: CardProps) {
    const [isFlipping, setIsFlipping] = useState(false)
    const [flipped, setFlipped] = useState(false)

    useEffect(() => { }, [isFlipping])

    const flipCard = (event: any) => {
        if (isFlipping) return
        classes.push(styles.flip)
        setIsFlipping(true)
        setTimeout(() => {
            setFlipped(!flipped)
            setTimeout(() => {
                classes = [styles.card]
                setIsFlipping(false)
            }, 500)
        }, 500)
    }

    if (flipped) {
        return (
            <div className={classes.join(" ")} onClick={flipCard}>
                <div className={styles.cardBack} />
            </div>
        )
    }

    if (suit == 'J') { // jokers
        return (
            <div className={classes.join(" ")} onClick={flipCard}>
                <p>Placeholder for Joker</p>
                <p className="cardValue" hidden>{value + " of " + suit}</p>
            </div>
        )
    }

    const suitEntity = Suits[suit];
    if (suit == 'H' || suit == 'D') {
        return (
            <div style={{ color: "red" }} className={classes.join(" ")} onClick={flipCard}>
                <div className={styles.suit}>{suitEntity}</div>
                <div className={styles.value}>{value}</div>
                <div className={styles.suitBottom}>{suitEntity}</div>
                <p className="cardValue" hidden>{value + " of " + suit}</p>
            </div>
        )
    }
    else {
        return (
            <div className={classes.join(" ")} onClick={flipCard}>
                <div className={styles.suit}>{suitEntity}</div>
                <div className={styles.value}>{value}</div>
                <div className={styles.suitBottom}>{suitEntity}</div>
                <p className="cardValue" hidden>{value + " of " + suit}</p>
            </div>
        )
    }
}