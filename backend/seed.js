require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
const getSampleBlogs = require('./data/sampleBlogs');

/**
 * Non-destructive demo seed.
 * - Keeps all existing users (auth is never touched).
 * - Keeps any user-created articles.
 * - Inserts only the demo articles that are missing (idempotent by title).
 *
 * Run with: npm run seed
 * To wipe demo content and start clean, use: npm run seed:reset
 */
const seed = async () => {
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
      console.log(`Attaching demo articles to existing user: ${owner.email}`);
    }

    const sampleBlogs = getSampleBlogs(owner._id);
    const existingTitles = new Set(
      (await Blog.find({}, 'title').lean()).map((b) => b.title)
    );

    let inserted = 0;
    for (const blog of sampleBlogs) {
      if (existingTitles.has(blog.title)) continue;
      await Blog.create(blog);
      inserted += 1;
    }

    const total = await Blog.countDocuments();
    console.log(
      `Demo seed complete: ${inserted} new article(s) added, ${sampleBlogs.length - inserted} already present.`
    );
    console.log(`Total articles in database: ${total}. Existing users were preserved.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
