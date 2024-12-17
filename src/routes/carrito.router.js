//Vinculo el carrito a la app
import express from "express";
import { Router } from "express";
const carritoRouter = Router();
import fs from "fs/promises"
import { json } from "node:stream/consumers";

class cartManager {
    static ultimoID = 0;
    constructor(path) {
        this.carts = [];
        this.path = path;
    }

    async addCart() {
        const arrayCarritos = await this.leerArchivo();
        const nuevoCarrito = {
            id: ++cartManager.ultimoID,
            products: []
        }
arrayCarritos.push(nuevoCarrito);
await this.guardaDato(arrayCarritos);
    }

    async getCartByID(id) {
        const arrayCarritos = await this.leerArchivo();
        const carrito = arrayCarritos.find(item => item.id === id);
        if (!carrito) {
            return "No funciona";
        }else {
            return carrito;
        }
    }

    async addProductToCart(cartID, productID) {
        const arrayCarritos = await this.leerArchivo();
        const carrito = arrayCarritos.find(item => item.id === cartID);
        if(!carrito){
            return "No funciona";
        }else{
            const producto = {
                product: productID,
                quantity: 1
            }
carrito.products.push(producto);
await this.guardaDato(arrayCarritos);
        }
    }

    async guardaDato(arrayCarritos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayCarritos, null, 2))
        }catch (error){
            console.log(`${Error}, al guardar el archivo`);
        }
    }

    async leerArchivo(){
        try{
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayCarritos = JSON.parse(respuesta);
            return arrayCarritos;
        }catch (error) {
            console.log(`${error}, al leer el archivo`);
        }
    }
}

const cmanagerAdentro = new cartManager("./src/data/cart.json");

carritoRouter.post("/", async (requestAnimationFrame, res) => {
    await cmanagerAdentro.addCart();
    res.json({mensaje: "Carrito agregado"});
});

carritoRouter.get("/:cid", async (requestAnimationFrame, res) => {
    const cart = await cmanagerAdentro.getCartByID(requestAnimationFrame.params.cid);
    if (cart === "No funciona") {
        res.status(404).json({ error: "Carrito no encontrado"});
    } else {
        res.json(cart)
    }
});

carritoRouter.post("/:id/product/:id", async (req, res) => {
    await cmanagerAdentro.addProductToCart(req.params.cid, req.params.pid);
    res.json({mensaje: "Producto agregado al carrito"});
});

export default carritoRouter;