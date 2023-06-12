import express from 'express'
import cors from 'cors'
import {createServer } from "http"
import { Server } from "socket.io";

import { dbConnection } from '../database/config.js';
import { routerAuth} from '../routes/auth.js'
import {routerCategoria} from '../routes/categorias.js'
import { routerProducto } from '../routes/productos.js';
import { routerBuscar } from '../routes/buscar.js';
import { routerUploads } from '../routes/uploads.js';
import fileUpload from 'express-fileupload';
import { router } from '../routes/usuarios.js';
import {socketController} from "../sockets/controller.js"

export class ServerChat {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io     = new Server( this.server );

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }

        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //sockets
        this.sockets()
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {

        this.app.use( this.paths.auth,routerAuth);
        this.app.use( this.paths.buscar,routerBuscar);
        this.app.use( this.paths.categorias,routerCategoria);
        this.app.use( this.paths.productos,routerProducto);
        this.app.use(this.paths.usuarios, router);
        this.app.use(this.paths.uploads, routerUploads);

    }

    sockets(){
        this.io.on("connection",(socket)=> socketController(socket,this.io))
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}