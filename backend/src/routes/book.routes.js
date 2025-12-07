const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', upload.single('cover'), bookController.createBook);
router.put('/:id', upload.single('cover'), bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;
