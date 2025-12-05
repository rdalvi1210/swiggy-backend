import Order from "../models/foodorder.model.js";
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

