import cartModel from "../models/cartModels.js";

class CartManager {
    async crearCarrito() {
        try {
            const nuevoCarrito = new cartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.error('Error al crear el carrito en el gestor', error);
            throw error;
        }
    }

    async getCarritoById(cartId) {
        try {
            const carrito = await cartModel.findById(cartId);
            if (!carrito) {
                console.log("No existe el id");
                return "ID inexistente";
            }

            return carrito;
        } catch (error) {
            console.log("No existe el carrito", error);
        }
    }

    async agregarProducto(cartId, productId, quantity = 1) {
        try {
            const carrito = await this.getCarritoById(cartId);
            const existeProducto = carrito.products.find(item => item.product.toString() === productId);

            if (existeProducto) {
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({ product: productId, quantity });
            }

            //Se cambia "products" antes de guardar: 
            carrito.markModified("products");

            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("error al agregar un producto", error);
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            throw error;
        }
    }


    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            throw error;
        }
    }

    async actualizarCantidad(cartId, productId, newQuantity) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Producto no encontrado en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            throw error;
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            throw error;
        }
    }
}

export default CartManager;