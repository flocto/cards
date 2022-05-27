import React from 'react'
import styles from '../styles/Card.module.css'

type Dictionary = { [index: string]: string }
type CardProps = {
    suit: string,
    value: string
}

const Suits: Dictionary = { 'S': String.fromCharCode(0x2660), 'H': String.fromCharCode(0x2665), 'D': String.fromCharCode(0x2666), 'C': String.fromCharCode(0x2663) }
export const Card = ({ suit, value }: CardProps) => {
    const suitEntity = Suits[suit];
    if (suit == 'H' || suit == 'D') {
        return (
            <div style={{ color: "red" }} className={styles.card}>
                <div className={styles.suit}>{suitEntity}</div>
                <div className={styles.value}>{value}</div>
                <div className={styles.suitBottom}>{suitEntity}</div>
                <p className="cardValue" hidden>{value + " of " + suit}</p>
            </div>
        )
    }
    else {
        return (
            <div className={styles.card}>
                <div className={styles.suit}>{suitEntity}</div>
                <div className={styles.value}>{value}</div>
                <div className={styles.suitBottom}>{suitEntity}</div>
                <p className="cardValue" hidden>{value + " of " + suit}</p>
            </div>
        )
    }
}