const express = require('express');
const router = express.Router();

const videoRoutes = require('./video.routes');
const bookRoutes = require('./book.routes');
const categoryRoutes = require('./category.routes');

router.use('/videos', videoRoutes);
router.use('/books', bookRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
