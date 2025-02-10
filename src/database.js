import mongoose from "mongoose";

mongoose.connect("mongodb+srv://lutherrola:visa2010@cluster0.vxsf0.mongodb.net/TPFinal")
    .then(()=> console.log("Estás conectado a la BD"))  //Conexión a la base de datos       
    .catch((error)=> console.log("No hay conección en la BD, error:", error));