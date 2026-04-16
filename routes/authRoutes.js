import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {

  try {

    const { name, email, phone, password, role, businessName, address, category } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      role,
      businessName,
      address,
      category
    });

    await user.save();

    res.json({ message: "User Registered Successfully" });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server Error" });

  }

});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // ✅ FIX: use id instead of sellerId
    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        category: user.category
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        category: user.category,
        isPremium: user.isPremium || false
      }
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Login Failed" });

  }

});

/* ================= PROFILE ================= */

router.get("/me", authMiddleware, async (req, res) => {

  try {

    // ✅ FIX: req.user already has user
    res.json(req.user);

  } catch (err) {

    res.status(500).json({
      message: "Failed to load profile"
    });

  }

});

/* ================= SUBSCRIBE ================= */

router.post("/subscribe", authMiddleware, async (req, res) => {

  try {

    const { type } = req.body;

    // ✅ FIX: use req.user._id
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        subscriptionType: type
      },
      { new: true }
    );

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: "Subscription failed"
    });

  }

});

export default router;