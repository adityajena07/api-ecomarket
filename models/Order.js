import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    processingUnitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type: String,
        enum: ["PLACED", "ACCEPTED", "PICKED"],
        default: "PLACED",
    },

},
{ timestamps: true }
);

export default mongoose.model("Order", orderSchema);