import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productSlug: { type: String, enum: ["basic", "plus", "premium"] },
        productName: { type: String, trim: true },
        productNameAr: { type: String, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, enum: ["KWD"], default: "KWD" },
    stripeCheckoutAmountCents: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },
    stripeCheckoutCurrency: {
      type: String,
      required: true,
      enum: ["USD"],
      default: "USD",
    },
    kwdToUsdTestRate: {
      type: Number,
      required: true,
      min: Number.MIN_VALUE,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "cancelled"],
      default: "pending",
    },
    stripeCheckoutSessionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    stripePaymentIntentId: { type: String, trim: true },
    paidAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const Order =
  mongoose.models.Order ?? mongoose.model("Order", orderSchema);
