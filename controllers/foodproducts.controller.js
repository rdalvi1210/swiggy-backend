import FoodStore from "../models/foodstore.model.js";

// ===========================================
// GET ALL PRODUCTS (PUBLIC)
// ===========================================
export const getProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    return res.status(200).json({
      success: true,
      products: store.productList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products new merge",
    });
  }
};

// ===========================================
// ADD PRODUCT (SELLER ONLY)
// ===========================================
export const addProduct = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, price, category, image, description, isVeg } = req.body;

    if (!name || !price || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "name, price, category, image are required",
      });
    }

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    store.productList.push({
      name,
      price,
      category,
      image,
      description: description || "",
      isVeg: isVeg || false,
    });

    await store.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      products: store.productList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};

// ===========================================
// UPDATE PRODUCT (SELLER ONLY)
// ===========================================
export const updateProduct = async (req, res) => {
  try {
    const { storeId, productIndex } = req.params;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    const product = store.productList[productIndex];
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    Object.assign(product, req.body);

    await store.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      products: store.productList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

// ===========================================
// DELETE PRODUCT (SELLER ONLY)
// ===========================================
export const deleteProduct = async (req, res) => {
  try {
    const { storeId, productIndex } = req.params;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    if (!store.productList[productIndex]) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    store.productList.splice(productIndex, 1);
    await store.save();

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      products: store.productList,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

// ===========================================
// SEARCH PRODUCTS (PUBLIC)
// ===========================================
export const searchProducts = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { keyword } = req.query;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    const match = store.productList.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return res.status(200).json({
      success: true,
      keyword,
      results: match.length,
      items: match,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while searching products",
    });
  }
};

// get restaurants that include category that select by the user

export const getRestaurantsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    console.log(category);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    // Normalize input
    const searchKey = category.trim().toLowerCase();

    // Find stores whose product categories match case-insensitively
    const stores = await FoodStore.find({
      "productList.category": { $regex: searchKey, $options: "i" },
    });

    return res.status(200).json({
      success: true,
      restaurants: stores,
    });
  } catch (err) {
    console.error("CATEGORY SEARCH ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error cate",
    });
  }
};


export const getProductsOfStoreByCategory = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { category } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
      });
    }

    const store = await FoodStore.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // If no category, return all products of that store
    let products = store.productList || [];

    if (category) {
      const key = category.toLowerCase().trim();
      products = products.filter(
        (p) => p.category && p.category.toLowerCase().trim() === key
      );
    }

    return res.status(200).json({
      success: true,
      store,
      products,
    });
  } catch (err) {
    console.error("STORE CATEGORY ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
