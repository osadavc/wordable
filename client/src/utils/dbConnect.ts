import mongoose from "mongoose";

const { MONGODB_URL } = process.env;
let connection: Promise<typeof mongoose> | null = null;

const dbConnect = async () => {
  if (connection == null) {
    connection = mongoose.connect(MONGODB_URL!, {
      serverSelectionTimeoutMS: 5000,
    });

    await connection;
  }

  return connection;
};

export default dbConnect;
