import {Router} from 'express'
import {check} from 'express-validator'

import { validarCampos } from '../middlewares/validar-campos.js';
import { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from "../helpers/db-validators.js"
import { validarArchivoSubir } from '../middlewares/validar-archivo.js';

export const routerUploads=Router()


routerUploads.post( '/', validarArchivoSubir, cargarArchivo );

routerUploads.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary )
// ], actualizarImagen )

routerUploads.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen  )