import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const userToken = req.cookies?.token;
    const sellerToken = req.cookies?.seller_token;

    // Pick whichever is available
    const token = userToken || sellerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data to request
    req.user = decoded;
    // decoded = { id, role }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
