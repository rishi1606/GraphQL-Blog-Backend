import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/graphql-blog-app';

  try {
    console.log(`📡 Attempting to connect to MongoDB at: ${uri}`);
    // Try connecting with a short 3-second serverSelectionTimeout so it doesn't hang if Mongo isn't running locally
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return false; // Returns false indicating it's not using memory server
  } catch (error) {
    console.warn(`⚠️ Local/Remote MongoDB connection failed: ${error.message}`);
    console.log(`🚀 Automatic Fallback: Starting embedded In-Memory MongoDB Server for zero-config testing...`);

    try {
      mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`✨ In-Memory MongoDB Server Active & Connected at: ${inMemoryUri}`);
      console.log(`💡 Note: Data is stored in memory for this development/demo session.`);
      return true; // Returns true indicating in-memory server is active
    } catch (memError) {
      console.error(`❌ Critical: Failed to start In-Memory MongoDB:`, memError);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      console.log('🛑 In-Memory MongoDB Server Stopped.');
    }
  } catch (err) {
    console.error('Error during DB disconnect:', err);
  }
};

export default connectDB;
