import Cart from "../models/foodcart.model.js";
import Order from "../models/foodorder.model.js";
import FoodStore from "../models/foodstore.model.js";

export const createOrder = async (req, res) => {
  try {
    const {
      address,
      items,
      storeId,
      amount,
      paymentMethod,
      paymentStatus,
      paymentDetails,
    } = req.body;

    const userId = req.user.id; // from auth middleware

    // 1. Create Order
    const newOrder = await Order.create({
      userId,
      storeId,
      items,
      address,
      orderTotal: amount,
      paymentMethod,
      paymentStatus,
      paymentDetails,
    });

    // 2. CLEAR USER CART AFTER ORDER CONFIRMATION
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: [],
          store: null,
        },
      }
    );

    return res.status(201).json({
      success: true,
      orderId: newOrder._id,
      message: "Order placed successfully",
    });
  } catch (err) {
    console.log("ORDER CREATE ERROR", err);
    return res.status(500).json({
      success: false,
      message: "Order create failed",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("storeId", "storeName coverImage");

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      createdAt: order.createdAt,

      // Order Status
      orderStatus: order.orderStatus || "pending",

      // Price
      orderTotal: order.orderTotal,

      // Payment Details
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentDetails: order.paymentDetails || {},

      // Address
      address: order.address || {
        fullAddress: "Address unavailable",
        pincode: "",
        label: "",
      },

      // Items list
      items: order.items || [],

      // Store info
      store: order.storeId
        ? {
            _id: order.storeId._id,
            storeName: order.storeId.storeName,
            coverImage: order.storeId.coverImage,
          }
        : {
            _id: null,
            storeName: "Store Removed",
            coverImage:
              "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
          },
    }));

    return res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.log("FETCH ORDERS ERROR", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

//sellers Orders

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user?.id; // seller must be logged in

    if (!sellerId) {
      return res.status(401).json({ message: "Unauthorized seller" });
    }

    // 1) Find all stores owned by this seller
    const stores = await FoodStore.find({ sellerId });

    if (!stores.length) {
      return res.status(404).json({
        message: "No stores found for this seller",
        orders: [],
      });
    }

    // Extract all store IDs
    const storeIds = stores.map((s) => s._id);

    // 2) Fetch all orders for these stores
    const orders = await Order.find({ storeId: { $in: storeIds } })
      .populate("userId", "name email") // user details
      .populate("storeId", "storeName coverImage") // store details
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json({
      message: "Seller orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      userId, // 🔐 user can fetch only their own order
    }).populate("storeId", "storeName coverImage");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Format response exactly per schema
    const formattedOrder = {
      _id: order._id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,

      // Status
      orderStatus: order.orderStatus,

      // Pricing
      orderTotal: order.orderTotal,

      // Payment
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentDetails: order.paymentDetails || {},

      // Address snapshot
      address: {
        label: order.address?.label || "",
        fullAddress: order.address?.fullAddress || "",
        pincode: order.address?.pincode || "",
      },

      // Items
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        isVeg: item.isVeg,
      })),

      // Store snapshot
      store: order.storeId
        ? {
            _id: order.storeId._id,
            storeName: order.storeId.storeName,
            coverImage: order.storeId.coverImage,
          }
        : {
            _id: null,
            storeName: "Store Removed",
            coverImage:
              "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
          },
    };

    return res.status(200).json({
      success: true,
      order: formattedOrder,
    });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
