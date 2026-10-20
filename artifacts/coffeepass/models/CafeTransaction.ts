import mongoose from "mongoose";
import { DEMO_CAFE_SLUG } from "./CafePortalAccess";

const cafeTransactionSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, trim: true },
    cafeSlug: {
      type: String,
      required: true,
      enum: [DEMO_CAFE_SLUG],
    },
    source: {
      type: String,
      required: true,
      enum: ["demo", "redemption"],
      default: "demo",
    },
    label: { type: String, required: true, trim: true, maxlength: 100 },
    labelAr: { type: String, required: true, trim: true, maxlength: 100 },
    cups: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
    // Store KWD in fils to avoid floating-point totals.
    estimatedEarningsFils: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    occurredAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const CafeTransaction =
  mongoose.models.CafeTransaction ??
  mongoose.model("CafeTransaction", cafeTransactionSchema);
