import "server-only";

import { cache } from "react";
import { Product } from "@/models/Product";
import { connectDB } from "./db";
import { isPlanId, type Plan } from "./data";

export type MembershipCatalog =
  | { available: true; plans: Plan[] }
  | { available: false; plans: [] };

export const getMembershipCatalog = cache(
  async (): Promise<MembershipCatalog> => {
    try {
      await connectDB();

      const products = await Product.find({ category: "membership" })
        .select(
          "slug name nameAr description descriptionAr price cups rolloverLimit image",
        )
        .sort({ sortOrder: 1 })
        .lean()
        .exec();

      const expectedIds = ["basic", "plus", "premium"];
      if (
        products.length !== expectedIds.length ||
        products.some(
          (product, index) => product.slug !== expectedIds[index],
        ) ||
        products.some((product) => !isPlanId(product.slug))
      ) {
        return { available: false, plans: [] };
      }

      const plans: Plan[] = products.map((product) => ({
        id: product.slug as Plan["id"],
        name: product.name,
        nameAr: product.nameAr,
        description: product.description,
        descriptionAr: product.descriptionAr,
        cups: product.cups,
        price: product.price,
        rollover: product.rolloverLimit,
        image: product.image,
      }));

      return { available: true, plans };
    } catch {
      return { available: false, plans: [] };
    }
  },
);
