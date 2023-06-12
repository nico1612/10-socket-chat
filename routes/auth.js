import {Router} from 'express'
import {check} from 'express-validator'

import {googleSignin, login, renovarToken} from '../controllers/auth.js'
import {validarCampos} from '../middlewares/validar-campos.js';
import {validarJWT} from '../middlewares/validar-jwt.js';

export const routerAuth = Router();

routerAuth.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

routerAuth.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );

routerAuth.get('/',[validarJWT], renovarToken)