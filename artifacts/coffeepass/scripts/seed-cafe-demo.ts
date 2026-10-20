import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import {
  CafePortalAccess,
  DEMO_CAFE_SLUG,
} from "../models/CafePortalAccess";
import { CafeTransaction } from "../models/CafeTransaction";
import { User } from "../models/User";

const sampleTransactions = [
  { label: "Morning filter coffee", labelAr: "قهوة اليوم الصباحية", earnings: 750 },
  { label: "Iced latte pickup", labelAr: "لاتيه مثلج", earnings: 900 },
  { label: "Espresso break", labelAr: "استراحة إسبريسو", earnings: 650 },
  { label: "Afternoon flat white", labelAr: "فلات وايت بعد الظهر", earnings: 850 },
  { label: "Cold brew stop", labelAr: "قهوة كولد برو", earnings: 800 },
  { label: "Evening coffee", labelAr: "قهوة المساء", earnings: 750 },
] as const;

async function seedCafeDemo() {
  const email = process.argv
    .slice(2)
    .find((argument) => argument !== "--")
    ?.trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Usage: db:seed-cafe-demo -- <existing-account-email>");
  }

  await connectDB();
  const user = await User.findOne({ email }).select("_id").exec();
  if (!user) {
    throw new Error("The selected existing CoffeePass account was not found.");
  }

  await CafePortalAccess.findOneAndUpdate(
    { user: user._id, cafeSlug: DEMO_CAFE_SLUG },
    { $setOnInsert: { user: user._id, cafeSlug: DEMO_CAFE_SLUG } },
    { upsert: true, setDefaultsOnInsert: true },
  ).exec();

  const now = Date.now();
  await Promise.all(
    sampleTransactions.map((transaction, index) =>
      CafeTransaction.findOneAndUpdate(
        { reference: `coffee-pass-demo-${index + 1}` },
        {
          $setOnInsert: {
            reference: `coffee-pass-demo-${index + 1}`,
            cafeSlug: DEMO_CAFE_SLUG,
            source: "demo",
            label: transaction.label,
            labelAr: transaction.labelAr,
            cups: 1,
            estimatedEarningsFils: transaction.earnings,
            occurredAt: new Date(now - index * 18 * 60 * 60 * 1000),
          },
        },
        { upsert: true, setDefaultsOnInsert: true },
      ).exec(),
    ),
  );

  const [access, transactions] = await Promise.all([
    CafePortalAccess.findOne({
      user: user._id,
      cafeSlug: DEMO_CAFE_SLUG,
    }).lean().exec(),
    CafeTransaction.find({
      cafeSlug: DEMO_CAFE_SLUG,
      source: "demo",
    })
      .select("cups estimatedEarningsFils")
      .lean()
      .exec(),
  ]);
  const earningsFils = transactions.reduce(
    (total, transaction) => total + transaction.estimatedEarningsFils,
    0,
  );
  if (
    !access ||
    transactions.length !== sampleTransactions.length ||
    earningsFils !== 4700
  ) {
    throw new Error("Demo café data persistence verification failed.");
  }

  console.info(
    `Verified demo café access and ${transactions.length} simulated transactions totaling ${(earningsFils / 1000).toFixed(3)} KWD. No customer orders were changed.`,
  );
}

try {
  await seedCafeDemo();
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : "Café demo setup failed. Check MongoDB Atlas connectivity.",
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
