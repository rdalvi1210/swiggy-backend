import FoodStore from "../models/foodstore.model.js";

// ===========================================
// GET FOOD STORE DETAILS (PUBLIC)
// ===========================================
export const getFoodStore = async (req, res) => {
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
      store,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching store",
    });
  }
};

// ===========================================
// UPDATE FOOD STORE (SELLER ONLY)
// ===========================================
export const updateFoodStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await FoodStore.findById(storeId);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Food store not found",
      });
    }

    // Allowed editable fields
    const allowedFields = [
      "storeName",
      "address",
      "cuisines",
      "deliveryTime",
      "openingTime",
      "closingTime",
      "coverImage",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    await store.save();

    return res.status(200).json({
      success: true,
      message: "Food store updated successfully",
      store,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating store",
    });
  }
};

export const searchStoresByName = async (req, res) => {
  try {
    const q = req.query.q?.trim();

    // 🚫 No search query → return empty
    if (!q) {
      return res.status(200).json({
        count: 0,
        stores: [],
      });
    }

    const searchRegex = new RegExp(q, "i");

    const stores = await FoodStore.find({
      $or: [
        { storeName: searchRegex },
        { address: searchRegex },
        { cuisines: searchRegex }, // ✅ better for array
      ],
    })
      .select("storeName address cuisines deliveryTime coverImage")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(); // 🔥 performance boost

    const formattedStores = stores.map((store) => ({
      storeId: store._id,
      storeName: store.storeName,
      address: store.address,
      cuisines: store.cuisines,
      deliveryTime: store.deliveryTime,
      coverImage: store.coverImage,
    }));

    return res.status(200).json({
      count: formattedStores.length,
      stores: formattedStores,
    });
  } catch (error) {
    console.error("Store search error:", error);
    return res.status(500).json({
      message: "Failed to search stores",
    });
  }
};
