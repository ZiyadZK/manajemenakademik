'use client'

const { io } = require("socket.io-client");

const hostname = `${process.env.NEXT_PUBLIC_SOCKET_API_URL}`

export const ioServer = io(`${process.env.NEXT_PUBLIC_SOCKET_API_URL}`, {
    auth: {
        api_key: process.env.NEXT_PUBLIC_SOCKET_API_KEY
    }
})