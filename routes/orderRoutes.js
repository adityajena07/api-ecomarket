import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* =====================================================
   1️⃣ BUY / PLACE ORDER
===================================================== */
router.post("/buy", authMiddleware, async (req, res) => {

  try {

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = await Order.create({

      productId: product._id,
      sellerId: product.sellerId,
      processingUnitId: req.user._id,
      status: "PLACED",

    });

    res.status(201).json(order);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Order creation failed" });

  }

});


/* =====================================================
   2️⃣ MY ORDERS (Processing dashboard)
===================================================== */
router.get("/my", authMiddleware, async (req, res) => {

  try {

    const orders = await Order.find({
      processingUnitId: req.user._id,
    })
      .populate("productId")
      .populate("sellerId", "businessName")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch orders" });

  }

});


/* =====================================================
   3️⃣ ALL ORDERS
===================================================== */
router.get("/processing/orders", authMiddleware, async (req, res) => {

  try {

    const user = req.user;

    const orders = await Order.find()
      .populate({
        path: "productId",
        match: { category: user.category }   // category filter
      })
      .populate("sellerId", "businessName")
      .sort({ createdAt: -1 });

    const filtered = orders.filter(o => o.productId);

    res.json(filtered);

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch orders" });

  }

});


/* =====================================================
   4️⃣ REQUEST PICKUP
===================================================== */
router.put("/request-pickup/:orderId", authMiddleware, async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(

      req.params.orderId,
      { status: "ACCEPTED" },
      { new: true }

    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Product.findByIdAndUpdate(order.productId, {
      status: "ACCEPTED",
    });

    res.json(order);

  } catch (err) {

    res.status(500).json({ message: "Failed to request pickup" });

  }

});


/* =====================================================
   5️⃣ MARK PICKED
===================================================== */
router.put("/picked/:orderId", authMiddleware, async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(

      req.params.orderId,
      { status: "PICKED" },
      { new: true }

    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Product.findByIdAndUpdate(order.productId, {
      status: "PICKED",
    });

    res.json(order);

  } catch (err) {

    res.status(500).json({ message: "Failed to mark picked" });

  }

});


/* =====================================================
   6️⃣ PROCESSING DASHBOARD STATS
===================================================== */
router.get("/processing/stats", authMiddleware, async (req, res) => {

  try {

    const processingUnitId = req.user._id;

    const available = await Order.countDocuments({
      processingUnitId,
      status: "PLACED",
    });

    const accepted = await Order.countDocuments({
      processingUnitId,
      status: "ACCEPTED",
    });

    const picked = await Order.countDocuments({
      processingUnitId,
      status: "PICKED",
    });

    res.json({
      available,
      accepted,
      picked,
    });

  } catch (err) {

    res.status(500).json({ message: "Failed to fetch stats" });

  }

});

export default router;