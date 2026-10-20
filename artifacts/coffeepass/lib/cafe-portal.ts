import "server-only";

import { CafePortalAccess } from "@/models/CafePortalAccess";
import { DEMO_CAFE_SLUG } from "@/models/CafePortalAccess";
import { CafeTransaction } from "@/models/CafeTransaction";
import { connectDB } from "./db";

export async function getCafePortalAccess(userId: string) {
  await connectDB();
  return CafePortalAccess.findOne({
    user: userId,
    cafeSlug: DEMO_CAFE_SLUG,
  })
    .select("cafeSlug")
    .lean()
    .exec();
}

export async function getCafeDemoDashboard(cafeSlug: string) {
  await connectDB();
  const rows = await CafeTransaction.find({
    cafeSlug,
    source: "demo",
  })
    .select("reference label labelAr cups estimatedEarningsFils occurredAt")
    .sort({ occurredAt: -1 })
    .limit(20)
    .lean()
    .exec();

  return {
    transactions: rows.map((row) => ({
      id: row.reference,
      label: row.label,
      labelAr: row.labelAr,
      cups: row.cups,
      estimatedEarningsFils: row.estimatedEarningsFils,
      occurredAt: row.occurredAt.toISOString(),
    })),
    redemptionCount: rows.length,
    cupCount: rows.reduce((total, row) => total + row.cups, 0),
    estimatedEarningsFils: rows.reduce(
      (total, row) => total + row.estimatedEarningsFils,
      0,
    ),
  };
}
