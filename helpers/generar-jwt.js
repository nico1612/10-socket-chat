import jwt from 'jsonwebtoken'

import {Usuario} from '../models/usuario.js';

export const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) => {

            if ( err ) {
                console.log(err);
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}

export const comprobarJWT=async(token='')=>{

    try{

        if(token.length<=0){
            return null
        }

        const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY)

        const usuario = await Usuario.findById(uid)

        if(usuario){
            if(usuario.estado){
                return usuario
            }
            else{
                return null
            }
        }
        else{
            return null
        }

    }
    catch(error){
        return null
    }

}