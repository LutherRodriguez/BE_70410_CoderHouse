import productModel from "../models/productModels.js";

class ProductManager {
   
    async addProduct({title, description, code, price, img, stock, category, thumbnails}) {
        try {
    
            if(!title || !description || !code || !price || !stock || !category) {
                console.log("Campos incompletos")
                return;
             }
             
            const existeProducto = await productModel.findOne({code: code});

            if(existeProducto) {
                console.log("El código debe ser único");
                return;
            }
    
            const nuevoProducto = new productModel({
                title,
                description,
                code,
                price,
                img,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });
    
            await nuevoProducto.save();
        } catch (error) {
            console.log(`${error}, no se pudo guardar el archivo`);
            throw error;
        }
    }

    async getProducts({limit = 10, page= 1, sort, query}= {}) {
        try {
            const skip = (page - 1) * limit;
            let queryOptions = {};
            if(query) {
            queryOptions = {category: query};
            }
        
            const sortOptions = {};
            if (sort === "asc" || sort === "desc") {
                sortOptions.price = sort === "asc" ? 1 : -1;
            }

            const productos = await productModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit);

            const totalProducts = await productModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProducts / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;  

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log(`${error}, al leer el archivo`);
            throw error;
        }
    }

    async getProductByID(id) {
        try {
            const producto = await productModel.findById(id);
            if(!producto) {
                console.log("ID inexistente");
                return "ID inexistente";
            }

            console.log("Producto encontrado");
            return producto;
        } catch (error) {
            console.log(`${error}, al leer el archivo`);
            throw error;
        }

    }

    async guardaProducto(id, productoActualizado) {
        try {
            const guardado = await productModel.findByIdAndUpdate(id, productoActualizado, {new: true});
            if(!guardado) {
                console.log("ID inexistente");
                return "ID inexistente";
            }

            console.log("Producto actualizado");
            return guardado;
        } catch (error) {
            console.log(`${error}, al leer el archivo`);
            throw error;
        }

    }

    async deleteProduct(id) {
        try {
            const eliminado = await productModel.findByIdAndDelete(id);
            if(!eliminado) {
                console.log("ID inexistente");
                return "ID inexistente";
            }

            console.log("Producto eliminado");
            return eliminado;
        } catch (error) {
            console.log(`${error}, al leer el archivo`);
            throw error;
        }
    }
}

export default ProductManager;
