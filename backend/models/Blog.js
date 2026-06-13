const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Artificial Intelligence',
        'Web Development',
        'Mobile Apps',
        'Cyber Security',
        'Cloud Computing',
        'Programming',
        'Gadgets',
        'Tech News',
      ],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    editorsPick: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
