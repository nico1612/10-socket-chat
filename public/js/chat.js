const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


let usuario = null
let socket = null

// Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');


const validarJWT=async()=>{

    const tokenS=localStorage.getItem('token') || ''

    if(tokenS.length<=10){
        window.location='index.html'
        throw new Error(' no hay token en el servidor') 
    }

    const resp= await fetch(url,{
        headers:{'x-token':tokenS}
    })

    const {usuario:userDB,token:tokenDB}=await resp.json()

    localStorage.setItem('token',tokenDB)
    usuario=userDB
    document.title=usuario.nombre

    conectarSocket()

}

const conectarSocket=async()=>{

    socket = io({
        'extraHeaders':{
            'x-token':localStorage.getItem('token')
        }
    })
    
    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes );
    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload )
    });
}

const main = async()=>{

    await validarJWT()
}

main()