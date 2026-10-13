import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  coffeePassMongoose?: MongooseCache;
};

const cached =
  globalForMongoose.coffeePassMongoose ??
  (globalForMongoose.coffeePassMongoose = {
    connection: null,
    promise: null,
  });

export async function connectDB() {
  if (cached.connection?.connection.readyState === 1) {
    return cached.connection;
  }
  if (cached.connection) {
    cached.connection = null;
    cached.promise = null;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        dbName: "coffeepass",
        serverSelectionTimeoutMS: 10_000,
        bufferCommands: false,
      })
      .then((connection) => connection)
      .catch(() => {
        cached.promise = null;
        throw new Error("MONGODB_CONNECTION_FAILED");
      });
  }

  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch {
    cached.promise = null;
    throw new Error("MONGODB_CONNECTION_FAILED");
  }
}
