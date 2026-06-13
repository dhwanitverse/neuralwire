const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getRelatedBlogs,
  getUserBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBlogs);
router.get('/user/my-blogs', protect, getUserBlogs);
router.get('/:id/related', getRelatedBlogs);
router.get('/:id', getBlog);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
