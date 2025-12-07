const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const videoController = require('../controllers/videoController');

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', upload.single('cover'), videoController.createVideo);
router.put('/:id', upload.single('cover'), videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
