import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Product from "../models/Product.js"; // ✅ FIX: missing import

import {
  addProduct,
  getSellerProducts,
  getProcessingProducts
} from "../controllers/productController.js";

const router = express.Router();

/* ================= ADD PRODUCT ================= */
router.post("/add", authMiddleware, addProduct);

/* ================= SELLER PRODUCTS ================= */
router.get("/my-products", authMiddleware, getSellerProducts);

/* ================= PROCESSING PRODUCTS ================= */
router.get("/processing", authMiddleware, getProcessingProducts);

/* ================= DELETE PRODUCT ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Ensure only owner can delete
    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (err) {

    console.error(err); // ✅ better debugging
    res.status(500).json({ message: "Delete failed" });

  }
});

export default router;