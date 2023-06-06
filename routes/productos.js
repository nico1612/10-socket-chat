import { Router } from "express"
import { check } from "express-validator"

import { validarJWT } from "../middlewares/validar-jwt.js"
import { esAdminRole } from "../middlewares/validar-roles.js"
import { validarCampos } from "../middlewares/validar-campos.js"
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from "../controllers/productos.js"
import { existeCategoriaPorId, existeProductoPorId } from "../helpers/db-validators.js"

export const routerProducto=Router()


/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
routerProducto.get('/', obtenerProductos );

// Obtener una categoria por id - publico
routerProducto.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto );

// Crear categoria - privado - cualquier persona con un token válido
routerProducto.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

// Actualizar - privado - cualquiera con token válido
routerProducto.put('/:id',[
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

// Borrar una categoria - Admin
routerProducto.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], borrarProducto);