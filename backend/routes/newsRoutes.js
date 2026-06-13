const express = require('express');
const { getAllNews, getNewsByField, getFields } = require('../controllers/newsController');

const router = express.Router();

router.get('/fields', getFields);
router.get('/field/:field', getNewsByField);
router.get('/', getAllNews);

module.exports = router;
