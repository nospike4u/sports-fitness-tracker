import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `MongoDB Connected: ${conn.connection.host}`,
      process.env.MONGODB_URI
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
  const testData = await mongoose.connection.db.collection('users').find().toArray();
  console.log('Sample data:', testData);
};


export default connectDB;
