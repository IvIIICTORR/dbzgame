import { io } from 'socket.io-client'

export const websocket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  autoConnect: false,
  path: '/websocket',
})
