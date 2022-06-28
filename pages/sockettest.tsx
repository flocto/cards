import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
let socket: Socket;
export default function sockettest(props: any) {
  const [input, setInput] = useState('')

  useEffect((): any => {
    // Not sure if it is due to Next or some other issue,
    // but socket is sometimes connected multiple times
    // however, client browser is only connected once, 
    // meaning there are some invisible connections that do not get used OR destroyed
    socket = io('', { path: '/api/hello' })

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    socket.on('update-input', msg => {
      setInput(msg)
    })

    if (socket) return () => {
      socket.disconnect();
    }
  }, []);


  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    socket.emit('update-input', e.target.value)
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}

