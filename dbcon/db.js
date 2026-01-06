import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect(
      "mongodb+srv://rdalvi1210:9876543210@cluster0.0vqrqtj.mongodb.net/"
    )
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
}
