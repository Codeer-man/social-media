import mongoose from "mongoose";

const URI = process.env.MONGO_URI!;

export default async function connectToDB() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to database");
  } catch (error) {
    console.error("Something went wrong while connecting to db", error);
    process.exit(1);
  }
}
