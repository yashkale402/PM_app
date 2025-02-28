import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: any;
}

export async function dbConnect() {
  if (global.mongooseConn) {
    return global.mongooseConn;
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI in your .env");
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    global.mongooseConn = conn;
    console.log("MongoDB connected");
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
