import Cart from "../models/foodcart.model.js";
import FoodStore from "../models/foodstore.model.js";

/* ============================================================
   SAFE PRODUCT FINDER (fixes id() not working)
   ============================================================ */
const findProductSafe = (store, productId) => {
  // 1) Try Mongoose DocumentArray `.id()`
  let prod = null;
  try {
    prod = store.productList.id(productId);
  } catch (err) {
    prod = null;
  }

  if (prod) return prod;

  // 2) Fallback: manually match _id as string
  return store.productList.find((p) => String(p._id) === String(productId));
};

/* ============================================================
   BUILD CART RESPONSE
   ============================================================ */
const buildCartResponse = async (cart) => {
  if (!cart || cart.items.length === 0) return [];

  const storeId = cart.items[0].storeId;
  const store = await FoodStore.findById(storeId);
  if (!store) return [];

  return cart.items.map((item) => {
    const product = findProductSafe(store, item.productId);

    return {
      storeId: item.storeId,
      productId: item.productId,
      quantity: item.quantity,
      name: product?.name || "Unknown",
      price: product?.price || 0,
      image: product?.image || "",
      isVeg: product?.isVeg || false,
      description: product?.description || "",
    };
  });
};

/* ============================================================
   ADD TO CART
   ============================================================ */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId, productId } = req.body;

    if (!storeId || !productId) {
      return res.status(400).json({
        success: false,
        message: "storeId and productId are required",
      });
    }

    let cart = await Cart.findOne({ userId });

    /* ---------------------------------------------------------
       STEP 1 — If store mismatch → RESET cart FIRST
       --------------------------------------------------------- */
    if (cart && cart.items.length > 0) {
      const currentStore = String(cart.items[0].storeId);
      if (currentStore !== String(storeId)) {
        cart.items = [];
        await cart.save();
      }
    }

    /* ---------------------------------------------------------
       STEP 2 — Validate store
       --------------------------------------------------------- */
    const store = await FoodStore.findById(storeId);
    if (!store)
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });

    /* ---------------------------------------------------------
       STEP 3 — Validate product (after reset)
       --------------------------------------------------------- */
    const product = findProductSafe(store, productId);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    /* ---------------------------------------------------------
       STEP 4 — Create cart if missing
       --------------------------------------------------------- */
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ storeId, productId, quantity: 1 }],
      });

      const detailed = await buildCartResponse(cart);
      return res.json({ success: true, cart: detailed });
    }

    /* ---------------------------------------------------------
       STEP 5 — Add or increment product
       --------------------------------------------------------- */
    const existing = cart.items.find(
      (i) => String(i.productId) === String(productId)
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ storeId, productId, quantity: 1 });
    }

    await cart.save();
    const detailed = await buildCartResponse(cart);

    res.json({ success: true, cart: detailed });
  } catch (err) {
    console.log("ADD CART ERROR:", err);
    res.status(500).json({ success: false, message: "Add to cart failed" });
  }
};

/* ============================================================
   REMOVE ITEM
   ============================================================ */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.json({ success: true, cart: [] });

    cart.items = cart.items.filter(
      (i) => String(i.productId) !== String(productId)
    );

    await cart.save();
    const detailed = await buildCartResponse(cart);

    res.json({ success: true, cart: detailed });
  } catch (err) {
    console.log("REMOVE ERROR:", err);
    res.status(500).json({ success: false, message: "Remove item failed" });
  }
};

/* ============================================================
   UPDATE QUANTITY
   ============================================================ */
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, action } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const item = cart.items.find(
      (i) => String(i.productId) === String(productId)
    );

    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });

    if (action === "inc") item.quantity++;
    if (action === "dec") item.quantity--;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => String(i.productId) !== String(productId)
      );
    }

    await cart.save();
    const detailed = await buildCartResponse(cart);

    res.json({ success: true, cart: detailed });
  } catch (err) {
    console.log("UPDATE QTY ERROR:", err);
    res.status(500).json({ success: false, message: "Update quantity failed" });
  }
};

/* ============================================================
   GET CART
   ============================================================ */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    const detailed = await buildCartResponse(cart);

    res.json({ success: true, cart: detailed });
  } catch (err) {
    console.log("GET CART ERROR:", err);
    res.status(500).json({ success: false, message: "Get cart failed" });
  }
};
