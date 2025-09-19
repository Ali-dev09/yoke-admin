import express from 'express';
import NewProduct from '../schemas/Product.mjs';
import ImageKit from "imagekit";

const escapeStringRegexp = (await import('escape-string-regexp')).default;

const router = express.Router();

// إعداد ImageKit
const imagekit = new ImageKit({
  publicKey: 'your_public_key',
  privateKey: 'your_private_key',
  urlEndpoint: 'https://ik.imagekit.io/your_project_id'
});

// إضافة منتج جديد
router.post('/add/product', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      message: 'Product added successfully',
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image ? 'Image uploaded' : null,
        sizes: product.sizes
      }
    });
  } catch (err) {
    console.error('Error adding product:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation error', details: errors });
    }
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// جميع المنتجات
router.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// منتجات للاستكشاف (10 بس)
router.get('/products/explore', async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// حسب الفئة
router.get('/category/:categoryName', async (req, res) => {
  const allowedCategories = [
    'ادوات احتياطية مولدات',
    'ادوات احتياطية 5 كي في',
    'ادوات احتياطية كامة',
    'ادوات احتياطية زراعي',
    'ادوات احتياطية حاشوشة',
    'ادوات احتياطية ميشار',
    'ماطور غسالة',
    'ماطور ماء',
    'أخرى',
    "الكل",
    "ادوات احتياطية كاملة"
  ];

  try {
    const categoryName = req.params.categoryName;
    if (!allowedCategories.includes(categoryName)) {
      return res.status(400).json({ error: 'Invalid category name' });
    }
    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// منتج واحد حسب ID
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// البحث
router.get('/search/:searchValue', async (req, res) => {
  try {
    const searchValue = decodeURIComponent(req.params.searchValue);
    console.log(searchValue);

    if (!searchValue || typeof searchValue !== 'string') {
      return res.status(400).json({ error: 'Invalid search value' });
    }

    const sanitizedSearch = escapeStringRegexp(searchValue);
    const searchRegex = new RegExp(sanitizedSearch, 'iu');

    const products = await Product.find({
      name: { $regex: searchRegex }
    }).limit(20);

    res.json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// المنتجات بدون صور (للتجربة)
router.get('/products/name', async (req, res) => {
  try {
    const products = await Product.find({}, { image: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ تحويل صورة منتج واحد من Base64 إلى ImageKit URL
router.get('/convert/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔎 Looking for product with ID:", id);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await NewProduct.findById(id);
    console.log("📦 Product from DB:", product);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.image) {
      return res.status(400).json({ error: "Product has no image to convert" });
    }

    const base64Data = product.image.includes(",")
      ? product.image.split(",")[1]
      : product.image;

    const fileBuffer = Buffer.from(base64Data, "base64");

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: `${product._id}.png`,
      folder: "/products"
    });

    product.image = uploadResponse.url;
    await product.save();

    console.log(`✅ Converted product ${product._id} successfully`);

    res.json({
      message: "Product image converted successfully",
      product: {
        id: product._id,
        name: product.name,
        image: product.image
      }
    });

  } catch (err) {
    console.error("❌ Conversion error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
