require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
const getSampleBlogs = require('./data/sampleBlogs');

/**
 * Reset demo data to a clean slate.
 * - Deletes ALL articles, then re-inserts the full demo set.
 * - Keeps all existing users (auth/accounts are never touched).
 *
 * Run with: npm run seed:reset
 */
const seedReset = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let owner = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    if (!owner) owner = await User.findOne().sort({ createdAt: 1 });
    if (!owner) {
      owner = await User.create({
        name: 'Alex Morgan',
        email: 'admin@techblog.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('No users found — created admin account: admin@techblog.com / admin123');
    } else {
      console.log(`Resetting demo articles under existing user: ${owner.email}`);
    }

    const removed = await Blog.deleteMany();
    console.log(`Cleared ${removed.deletedCount} existing article(s).`);

    const sampleBlogs = getSampleBlogs(owner._id);
    for (const blog of sampleBlogs) {
      await Blog.create(blog);
    }

    const total = await Blog.countDocuments();
    console.log(`Reset complete: ${total} demo articles inserted. Existing users were preserved.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed reset error:', error);
    process.exit(1);
  }
};

seedReset();
