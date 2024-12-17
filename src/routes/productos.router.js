//Vinculo con la app
import express from "express";
import { Router } from "express";
import { error } from "node:console";
const productoRouter = Router();
import fs from "fs/promises"
import { json } from "node:stream/consumers";


class productManager {
    static ultimoID = 0;
    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async addProduct({title, description, code, price, status, stock, category, thumbnails}) {
        const arrayProductos = await this.leerArchivo();
    
        if(!title || !description || !code || !price || !status || !stock || !category) {
            console.log("Campos incompletos")
            return;
        }
    
        if(arrayProductos.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }
    
        const nuevoProducto = {
            id: ++productManager.ultimoID,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
    
        arrayProductos.push(nuevoProducto);
        await this.guardaDato(arrayProductos);
    }
    
    async getProducts() {
        const arrayProductos = await this.leerArchivo();
        return arrayProductos;
    }

    async getProductByID(id) {
        const arrayProductos = await this.leerArchivo();
        const producto = arrayProductos.find(item => item.id === id);
        if(!producto) {
            return "ID inexistente";
        }else{
            return producto
        }
    }

    async guardaDato(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2))
        }catch (error) {
            console.log(`${error}, no se pudo guardar el archivo`);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error){
            console.log(`${error}, no se puede leer el archivo`);

        }
    }
}

const pmanagerAdentro = new productManager("./src/data/products.json");
productoRouter.get("/", async (req, res) => {
    const products = await pmanagerAdentro.getProducts();
    res.json(products)
});

productoRouter.get("/:pid", async (req, res) => {
    const product = await pmanagerAdentro.getProductByID(req.params.pid);
    if(product === "ID inexistente") {
        res.status(404).json({ error: "Producto no encontrado"});
    }else {
        res.json(product);
    }
});

productoRouter.post("/", async (req, res) => {
    const {title, description, code, price, status, stock, category, thumbnails} = req.body;
    await pmanagerAdentro.addProduct({ title, description, code, price, status, stock, category, thumbnails});
    res.json({mensaje: "Producto agregado"});
});

productoRouter.put("/pid", async (req, res) => {
    const product = await pmanagerAdentro.getProductByID(req.params.id);
    if (product === "ID inexistente") {
        res.status(404).json({error: "Producto no encontrado"});
    }else {
        const {title, description, code, price, status, stock, category, thumbnails} = req.body;
        product.title= title;
        product.description= description;
        product.code= code;
        product.price= price;
        product.status= status;
        product.stock= stock;
        product.category= category;
        product.thumbnails= thumbnails;
        await pmanagerAdentro.guardaDato([product]);
        res.json(product);
    }
});

productoRouter.delete("/:pid", async (req, res) => {
    const product = await pmanagerAdentro.getProductByID(req.params.pid);
    if(product === "ID inexistente") {
        res.status(404).json({ error: "Producto no encontrado"});
    }else {
        await pmanagerAdentro.guardaDato([]);
        res.json({mensaje: "Producto eliminado"});
    }
});

export default productoRouter