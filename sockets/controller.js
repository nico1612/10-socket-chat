import { Socket } from "socket.io"

export const socketController=(socket = new Socket())=>{

    console.log("cliente conectado",socket.id)
}