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

const dibujarUsuarios=(usuarios=[])=>{
    let usersHTML=''
    usuarios.forEach(({nombre,uid})=>{

        usersHTML+=`

        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class= "fs-g text-muted">${uid}</span>
            </p>
        </li>
        `
    })

    ulUsuarios.innerHTML=usersHTML

}

const dibujarMensajes=(mensajes=[])=>{

    console.log(mensajes)

    let mensajesHTML=''
    mensajes.forEach( ({ nombre, mensaje }) => {

            mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;
}
txtMensaje.addEventListener('keyup',({keyCode})=>{
    
    const mensaje =txtMensaje.value
    const uid= txtUid.value

    if(keyCode!==13){
        return
    }

    if(mensaje.length===0){
        return
    }

    socket.emit('enviar-mensaje',{mensaje,uid})

    txtMensaje.value=''
})

const main = async()=>{

    await validarJWT()
}

main()