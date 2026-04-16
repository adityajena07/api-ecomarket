import Product from "../models/Product.js";

/* ================= ADD PRODUCT ================= */
export const addProduct = async (req, res) => {
  try {

    const { category, products, totalPrice } = req.body;

    if (!category || !products || products.length === 0) {
      return res.status(400).json({
        message: "Products required"
      });
    }

    const newProduct = await Product.create({
      sellerId: req.user._id,
      category: category.trim().toLowerCase(), // ✅ FIX: clean + normalize
      products,
      totalPrice,
      status: "LISTED"
    });

    res.status(201).json(newProduct);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Product add failed"
    });

  }
};


/* ================= SELLER PRODUCTS ================= */
export const getSellerProducts = async (req, res) => {
  try {

    const products = await Product.find({
      sellerId: req.user._id
    }).sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch products"
    });

  }
};


/* ================= PROCESSING PRODUCTS ================= */
export const getProcessingProducts = async (req, res) => {
  try {

    const user = req.user;

    console.log("USER CATEGORY:", user.category);

    let query = { status: "LISTED" };

    if (!user.isPremium) {

      // ✅ FIX: case-insensitive match (Food vs food)
      query.category = new RegExp(`^${user.category?.trim()}$`, "i");

    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    console.log("FOUND PRODUCTS:", products);

    res.json(products);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch processing products"
    });

  }
};