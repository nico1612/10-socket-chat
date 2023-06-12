import {Router} from 'express'
import {check} from 'express-validator'

import {actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias} from '../controllers/categorias.js';
import {validarJWT} from '../middlewares/validar-jwt.js';
import {validarCampos} from '../middlewares/validar-campos.js';
import {existeCategoriaPorId} from '../helpers/db-validators.js';
import {esAdminRole} from '../middlewares/validar-roles.js';

export const routerCategoria=Router()

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
routerCategoria.get('/', obtenerCategorias );

// Obtener una categoria por id - publico
routerCategoria.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
], obtenerCategoria );

// Crear categoria - privado - cualquier persona con un token válido
routerCategoria.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar - privado - cualquiera con token válido
routerCategoria.put('/:id',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],actualizarCategoria );

// Borrar una categoria - Admin
routerCategoria.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos,
],borrarCategoria);