import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    isVeg: Boolean,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    label: String,
    fullAddress: String,
    pincode: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foodstore",
      required: true,
    },

    items: [orderItemSchema],

    address: addressSchema, // snapshot

    orderTotal: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "upi"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentDetails: {
      type: Object,
      default: {},
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
