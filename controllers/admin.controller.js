import FoodStore from "../models/foodstore.model.js";
import User from "../models/seller.model.js";


// ===========================================
// ADMIN: GET ALL PRODUCTS (ALL STORES)
// ===========================================
export const adminGetAllProducts = async (req, res) => {
  try {
    const stores = await FoodStore.find({}, "storeName productList");

    const allProducts = [];

    stores.forEach((store) => {
      store.productList.forEach((product) => {
        allProducts.push({
          storeId: store._id,
          storeName: store.storeName,
          productId: product._id,
          ...product.toObject(),
        });
      });
    });

    return res.status(200).json({
      success: true,
      total: allProducts.length,
      products: allProducts,
    });
  } catch (err) {
    console.error("ADMIN GET PRODUCTS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};


// ===========================================
// ADMIN: UPDATE PRODUCT
// ===========================================
export const adminUpdateProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const store = await FoodStore.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const product = store.productList.id(productId);
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
      product,
    });
  } catch (err) {
    console.error("ADMIN UPDATE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};


// ===========================================
// ADMIN: DELETE PRODUCT
// ===========================================
export const adminDeleteProduct = async (req, res) => {
  try {
    const { storeId, productId } = req.params;

    const store = await FoodStore.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const product = store.productList.id(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.remove();
    await store.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("ADMIN DELETE PRODUCT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};


export const adminGetAllStores = async (req, res) => {
  try {
    const stores = await FoodStore.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      total: stores.length,
      stores,
    });
  } catch (err) {
    console.error("ADMIN GET STORES ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching stores",
    });
  }
};


// ===========================================
// ADMIN: GET STORE BY ID
// ===========================================
export const adminGetStoreById = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      store,
    });
  } catch (err) {
    console.error("ADMIN GET STORE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===========================================
// ADMIN: UPDATE STORE
// ===========================================
export const adminUpdateStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await FoodStore.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const allowedFields = [
      "storeName",
      "address",
      "cuisines",
      "deliveryTime",
      "openingTime",
      "closingTime",
      "coverImage",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();

    return res.status(200).json({
      success: true,
      message: "Store updated successfully",
      store,
    });
  } catch (err) {
    console.error("ADMIN UPDATE STORE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating store",
    });
  }
};

// ===========================================
// ADMIN: DELETE STORE
// ===========================================
export const adminDeleteStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await FoodStore.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await store.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully",
    });
  } catch (err) {
    console.error("ADMIN DELETE STORE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting store",
    });
  }
};



// ===========================================
// ADMIN: GET ALL SELLERS
// ===========================================
export const adminGetAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" })
      .select("ownerName email role createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: sellers.length,
      sellers,
    });
  } catch (err) {
    console.error("ADMIN GET SELLERS ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching sellers",
    });
  }
};

// ===========================================
// ADMIN: DELETE SELLER
// ===========================================
export const adminDeleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findOne({
      _id: sellerId,
      role: "seller",
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    await seller.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Seller deleted successfully",
    });
  } catch (err) {
    console.error("ADMIN DELETE SELLER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting seller",
    });
  }
};
