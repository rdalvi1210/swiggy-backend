import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dnwnaheg1",
  api_key: process.env.CLOUDINARY_API_KEY || "312824197913557",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "ng-C0g5ArHTxswnqzm1yQfHceaE",
});

export default cloudinary;
