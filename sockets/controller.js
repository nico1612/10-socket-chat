import { Socket } from "socket.io"
import { comprobarJWT } from "../helpers/generar-jwt.js"

export const socketController=async(socket = new Socket())=>{

    const usuario = await comprobarJWT(socket.handshake.headers['x-token'])

    if(!usuario){
        
        return socket.disconnect
    }

    console.log('se conecto', usuario.nombre)
}