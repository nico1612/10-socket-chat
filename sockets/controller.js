import { Socket } from "socket.io"
import { comprobarJWT } from "../helpers/generar-jwt.js"
import { ChatMensajes } from "../models/chat-mensajes.js"

const chatMensajes= new ChatMensajes()

export const socketController=async(socket = new Socket(),io)=>{

    const usuario = await comprobarJWT(socket.handshake.headers['x-token'])

    if(!usuario){
        return socket.disconnect
    }

    chatMensajes.agregarUsuario(usuario)
    io.emit('usuarios-activos',chatMensajes.usuariosArr)
    io.emit('recibir-mensajes',chatMensajes.ultimos10)


    socket.join(usuario.id)

    socket.on('disconnect',()=>{
        ChatMensajes.borrarUsuario(usuario.id)
        io.emit('usuarios-activos',chatMensajes.usuariosArr)
    })

    socket.on('enviar-mensaje',(uid,mensaje)=>{

        if(uid){
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
        }
        else{
            chatMensajes.enviarMensaje(usuario.id,usuario.nombre,mensaje)
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        }

    })
}