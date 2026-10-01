import mongoose from "mongoose";

const NODE_ENV = process.env.NODE_ENV;
const MONGO_URL =
  NODE_ENV === "production"
    ? process.env.MONGO_PROD_URL
    : process.env.MONGO_TEST_URL;

if (!MONGO_URL) {
  throw new Error("Please provide the DB URL...");
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    console.log(
      `Successfully connected to ${
        NODE_ENV === "production" ? "PRODUCTION" : "TEST"
      } database...`,
    );
  } catch (error) {
    console.error("Error while connecting to the DB:", error);
    process.exit(1);
  }
};
