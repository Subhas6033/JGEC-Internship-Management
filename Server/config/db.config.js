import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) throw new Error(`Please provide the DB URL....`);

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Successfully Connected to the DB...`);
  } catch (error) {
    console.log(`Err!!! While connecting to the DB... ${error}`);
    process.exit(1);
  }
};
