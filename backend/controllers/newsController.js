const Blog = require('../models/Blog');

const VALID_FIELDS = [
  'Artificial Intelligence',
  'Web Development',
  'Mobile Apps',
  'Cyber Security',
  'Cloud Computing',
  'Programming',
  'Gadgets',
  'Tech News',
];

exports.getAllNews = async (req, res, next) => {
  try {
    const { field, search, limit } = req.query;
    const filter = {};

    if (field) {
      const matchedField = VALID_FIELDS.find(
        (f) => f.toLowerCase() === field.toLowerCase()
      );
      if (!matchedField) {
        return res.status(400).json({
          success: false,
          message: `Invalid field. Valid fields: ${VALID_FIELDS.join(', ')}`,
        });
      }
      filter.category = matchedField;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let query = Blog.find(filter).sort({ createdAt: -1 });
    if (limit) query = query.limit(parseInt(limit, 10));

    const news = await query;
    res.json({
      success: true,
      count: news.length,
      field: field || 'all',
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

exports.getNewsByField = async (req, res, next) => {
  try {
    const fieldParam = decodeURIComponent(req.params.field);
    const matchedField = VALID_FIELDS.find(
      (f) => f.toLowerCase() === fieldParam.toLowerCase()
    );

    if (!matchedField) {
      return res.status(400).json({
        success: false,
        message: `Invalid field "${fieldParam}". Valid fields: ${VALID_FIELDS.join(', ')}`,
      });
    }

    const news = await Blog.find({ category: matchedField }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: news.length,
      field: matchedField,
      data: news,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFields = async (req, res, next) => {
  try {
    const counts = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const fields = VALID_FIELDS.map((name) => {
      const found = counts.find((c) => c._id === name);
      return { name, count: found ? found.count : 0 };
    });

    res.json({ success: true, data: fields });
  } catch (error) {
    next(error);
  }
};
