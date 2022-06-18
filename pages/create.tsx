import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const {v4: uuidv4} = require('uuid')

export default function Create(){
    return (
        <div className={styles.container}>
        <Head>
            <title>Create Room</title>
            <meta name="description" content="Create a Room" />
        </Head>
        <main className={styles.main}>
            <form action="/api/create" method="post">
                <input type="text" name="name" placeholder="Room Name" />
                <input type="text" name="uuid" hidden readOnly value={uuidv4()} />
                <input type="submit" value="Create" />
            </form>
        </main>
        </div>
    )
}