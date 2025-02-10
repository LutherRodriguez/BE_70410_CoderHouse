import express from "express"
import {engine} from "express-handlebars";
import "./database.js";
import carritoRouter from "./routes/carrito.router.js";
import productoRouter from "./routes/productos.router.js";
import viewsRouter from "./routes/views.routers.js";

const app = express();
const PUERTO = 8080;

//Middelware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("./src/public")); //Para que pueda acceder a la carpeta publica
//Este último permite tomar datos complejos: varias qerys o datos de un formulario.

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//RUTAS
app.use("/api/cart", carritoRouter);
app.use("/api/products", productoRouter);
app.use("/", viewsRouter);

//Conexión al puerto
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

//const io = new Server(httpServer);

