import express from "express"
const app = express();
const PUERTO = 8080;
import carritoRouter from "./routes/carrito.router.js";
import productoRouter from "./routes/productos.router.js";

//Middelware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//Este último permite tomar datos complejos: varias qerys o datos de un formulario.

//RUTAS
app.use("/api/cart", carritoRouter);
app.use("/api/products", productoRouter);


//Escucho el PUERTO
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`)
})