import mongoose from "mongoose"

export const dbConnection = async()=>{

    try{
        await mongoose.connect(process.env.MONGODB_CNN)
        console.log("Base de datos conectada")
    }
    catch(error){
        console.log(error)
        throw new Error('Error a la hola de iniciar la base de datos')
    }
}