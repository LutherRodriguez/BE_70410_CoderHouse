import { Router } from "express";
const Viewsrouter = Router();

Viewsrouter.get("/", (req, res) => {
    res.render("index");
});

Viewsrouter.get("/", async (req, res) => {
    try {
        const products = await pmanagerAdentro.getProducts();
        res.render("home", {products});
    } catch (error){
        console.log(`${error}, no se puede leer el archivo`);
        res.render("home", {products: []});
    }
});

export default Viewsrouter;