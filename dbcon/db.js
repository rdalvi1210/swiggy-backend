import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect("mongodb://localhost:27017/swiggyDb")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
