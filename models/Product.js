import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema({

  name: String,

  brand: String,

  uan: String,

  quantity: Number,

  weightPerUnit: Number,

  mrp: Number,

  buyerPay: Number

});

const productSchema = new mongoose.Schema(
{

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  category: {
    type: String,
    required: true
  },

  products: [productItemSchema],

  totalPrice: Number,

  status: {
    type: String,
    enum: ["LISTED", "ACCEPTED", "PICKED"],
    default: "LISTED"
  }

},
{ timestamps: true }
);

export default mongoose.model("Product", productSchema);