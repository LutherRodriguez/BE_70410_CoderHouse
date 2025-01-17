import express from "express"
import {engine} from "express-handlebars";
const app = express();
const PUERTO = 8080;
import carritoRouter from "./routes/carrito.router.js";
import productoRouter from "./routes/productos.router.js";

//Middelware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public")); //Para que pueda acceder a la carpeta publica
//Este último permite tomar datos complejos: varias qerys o datos de un formulario.

//Express-handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//RUTAS
app.use("/api/cart", carritoRouter);
app.use("/api/products", productoRouter);


//Escucho el PUERTO
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})