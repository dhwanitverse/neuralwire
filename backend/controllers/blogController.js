const Blog = require('../models/Blog');
const slugify = require('slugify');

exports.getBlogs = async (req, res, next) => {
  try {
    const { search, category, featured, editorsPick, trending, limit } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (editorsPick === 'true') {
      filter.editorsPick = true;
    }

    let query = Blog.find(filter);
    if (trending === 'true') {
      query = query.sort({ views: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const blogs = await query;
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};

exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, content, category, image, author, authorAvatar, featured, editorsPick } = req.body;

    if (!title || !description || !content || !category || !image || !author) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const blog = await Blog.create({
      title,
      description,
      content,
      category,
      image,
      author,
      authorAvatar: authorAvatar || '',
      featured: featured || false,
      editorsPick: editorsPick || false,
      userId: req.user._id,
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An article with a similar title already exists. Please use a different title.',
      });
    }
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this blog' });
    }

    const updates = { ...req.body };
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    if (blog.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getRelatedBlogs = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const related = await Blog.find({
      _id: { $ne: blog._id },
      category: blog.category,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({ success: true, data: related });
  } catch (error) {
    next(error);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};
