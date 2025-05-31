import { Pool } from 'pg';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL configuration
export const pgPool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// MongoDB configuration
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arena');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// PostgreSQL connection test
export const testPgConnection = async () => {
  try {
    const client = await pgPool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
}; 