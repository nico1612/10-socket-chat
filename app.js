import * as dotenv from 'dotenv'
import { ServerChat } from './models/server.js'

dotenv.config()


const server = new ServerChat();



server.listen();