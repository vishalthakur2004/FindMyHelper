import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log(
      `MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log("MONGODB connection error: ", error);
    console.log("Starting server without MongoDB for development...");
    // Don't exit, continue without DB for development
  }
};

export default connectDB;
