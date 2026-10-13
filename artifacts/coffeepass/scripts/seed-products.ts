import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { membershipProductSeed } from "../lib/product-seed";
import { Product } from "../models/Product";

async function seedProducts() {
  await connectDB();

  await Promise.all(
    membershipProductSeed.map((product) =>
      Product.findOneAndUpdate(
        { slug: product.slug },
        { $set: product },
        {
          upsert: true,
          returnDocument: "after",
          setDefaultsOnInsert: true,
        },
      ),
    ),
  );

  const products = await Product.find({ category: "membership" })
    .select("slug name nameAr price cups rolloverLimit")
    .sort({ sortOrder: 1 })
    .lean()
    .exec();

  const expected = ["basic", "plus", "premium"];
  if (
    products.length !== expected.length ||
    products.some((product, index) => product.slug !== expected[index])
  ) {
    throw new Error("CoffeePass membership product verification failed.");
  }

  console.info(
    `Verified ${products.length} CoffeePass memberships in the coffeepass database.`,
  );
  for (const product of products) {
    console.info(
      `${product.slug}: ${product.name} / ${product.nameAr} — ${product.price} KWD, ${product.cups} cups, ${product.rolloverLimit} rollover`,
    );
  }
}

try {
  await seedProducts();
} catch {
  console.error(
    "CoffeePass product seeding failed. Check the MongoDB Atlas network access and Replit secret configuration.",
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
