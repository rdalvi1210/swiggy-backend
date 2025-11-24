import { model, Schema } from "mongoose";

const sellerSchema = Schema(
  {
    ownerName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    role: { type: String, default: "seller" },

    sellerType: {
      type: String,
      enum: ["restaurant", "food", "grocery"],
      required: true,
    },

    sellerTypeId: {
      type: Schema.Types.ObjectId, // NO REF HERE
      required: false,
    },
  },
  { timestamps: true }
);

const Seller = model("seller", sellerSchema);
export default Seller;
