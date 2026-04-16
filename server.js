import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

/* ========== MIDDLEWARE ========== */
app.use(cors());
app.use(express.json());

/* ========== ROUTES ========== */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* ========== TEST ROUTE ========== */
app.get("/", (req, res) => {
    res.send("EcoMarket Backend Running 🚀");
});

/* ========== DB CONNECT ========== */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => {
        console.error("Mongo Error ❌", err.message);
        process.exit(1);
    });

/* ========== SERVER START ========== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
