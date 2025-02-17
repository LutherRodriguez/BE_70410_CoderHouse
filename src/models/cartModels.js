import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]
});

// Middleware para la populación de productos
cartSchema.pre('findOne', function (next) {
  this.populate('products.product', '_id title price');
  next();
});

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;