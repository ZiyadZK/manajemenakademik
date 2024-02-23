import { Server } from "socket.io";

export const io = new Server();

io.on('connection', () => {
    console.log('SOCKET SERVER: Connected!')
})