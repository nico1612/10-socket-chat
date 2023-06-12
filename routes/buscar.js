import {Router} from "express";

import {buscar} from "../controllers/buscar.js";

export const routerBuscar=Router()

routerBuscar.get('/:coleccion/:termino', buscar )