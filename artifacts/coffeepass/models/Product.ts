import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ["basic", "plus", "premium"],
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    descriptionAr: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, enum: ["KWD"], default: "KWD" },
    image: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["membership"],
      default: "membership",
    },
    cups: { type: Number, required: true, min: 1, max: 20 },
    rolloverLimit: { type: Number, required: true, min: 0, max: 4, default: 0 },
    sortOrder: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export const Product =
  mongoose.models.Product ?? mongoose.model("Product", productSchema);
