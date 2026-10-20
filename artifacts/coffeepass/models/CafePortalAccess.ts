import mongoose from "mongoose";

export const DEMO_CAFE_SLUG = "coffee-pass-cafe-demo";

const cafePortalAccessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cafeSlug: {
      type: String,
      required: true,
      enum: [DEMO_CAFE_SLUG],
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

cafePortalAccessSchema.index({ user: 1, cafeSlug: 1 }, { unique: true });

export const CafePortalAccess =
  mongoose.models.CafePortalAccess ??
  mongoose.model("CafePortalAccess", cafePortalAccessSchema);
