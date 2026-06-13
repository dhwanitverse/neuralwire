const mongoose = require('mongoose');
const path = require('path');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techblog';

  if (process.env.USE_MEMORY_DB === 'true') {
    console.warn('[DB] USE_MEMORY_DB=true — accounts reset when the server restarts');
    return connectMemoryDB();
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await logUserCount();
    return conn;
  } catch (error) {
    console.warn(`Local MongoDB unavailable: ${error.message}`);
    console.log('Falling back to in-memory database for development...');
    return connectMemoryDB();
  }
};

async function logUserCount() {
  try {
    const User = require('../models/User');
    const count = await User.countDocuments();
    console.log(`[DB] Users in collection: ${count}`);
  } catch {
    /* ignore during startup */
  }
}

async function connectMemoryDB() {
  const { MongoMemoryServer } = require('mongodb-memory-server');

  const configs = [
    {
      instance: {
        dbName: 'techblog',
        launchTimeout: 120000,
        args: ['--nojournal'],
      },
      binary: {
        version: '6.0.16',
        downloadDir: path.join(__dirname, '../.cache/mongodb'),
      },
    },
    {
      instance: {
        dbName: 'techblog',
        launchTimeout: 120000,
      },
    },
  ];

  let lastError;
  for (const config of configs) {
    try {
      if (memoryServer) {
        await memoryServer.stop().catch(() => {});
        memoryServer = null;
      }
      memoryServer = await MongoMemoryServer.create(config);
      const conn = await mongoose.connect(memoryServer.getUri());
      console.log('In-memory MongoDB connected (dev mode)');
      await seedIfEmpty();
      return conn;
    } catch (err) {
      lastError = err;
      console.warn(`Memory DB attempt failed: ${err.message}`);
    }
  }

  console.error('\n❌ Could not start database. Options:');
  console.error('   1. Start MongoDB: net start MongoDB (as Administrator)');
  console.error('   2. Use MongoDB Atlas — set MONGODB_URI in backend/.env');
  console.error('   3. Set USE_MEMORY_DB=true in backend/.env and retry\n');
  throw lastError;
}

async function seedIfEmpty() {
  const User = require('../models/User');
  const Blog = require('../models/Blog');
  const getSampleBlogs = require('../data/sampleBlogs');

  const count = await User.countDocuments();
  if (count > 0) return;

  console.log('Seeding in-memory database with 18 sample articles...');
  const user = await User.create({
    name: 'Alex Morgan',
    email: 'admin@techblog.com',
    password: 'admin123',
    role: 'admin',
  });

  for (const blog of getSampleBlogs(user._id)) {
    await Blog.create(blog);
  }
  console.log('Seed complete. Demo login: admin@techblog.com / admin123');
}

module.exports = connectDB;
