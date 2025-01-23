import express from "express"
import {engine} from "express-handlebars";
const app = express();
const PUERTO = 8080;
import carritoRouter from "./routes/carrito.router.js";
import productoRouter from "./routes/productos.router.js";
import Viewsrouter from "./routes/views.routers.js";
import {Server} from "socket.io";

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
app.use("/", Viewsrouter);



//Escucho el PUERTO
/*app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})*/
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

const io = new Server(httpServer);

const usuarios = [
    {id:1, nombre: "Juan", apellido: "Perez"},
    {id:2, nombre: "Maria", apellido: "Gomez"},
    {id:3, nombre: "Carlos", apellido: "Lopez"},
    {id:4, nombre: "Ana", apellido: "Martinez"},
    {id:5, nombre: "Pedro", apellido: "Gimenez"},
]

io.on("connection", (socket) => {
    console.log("Usuario conectado");
    socket.on("mensaje", (data) => {
        console.log(data);
    })

    socket.emit("saludo", "Hola Front")

    socket.emit("usuarios", usuarios);
})