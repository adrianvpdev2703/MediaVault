const { Video, Category } = require('../models');

exports.getVideoById = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id, {
            include: Category,
        });
        if (!video)
            return res.status(404).json({ error: 'Video no encontrado' });
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const videos = await Video.findAll({ include: Category });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createVideo = async (req, res) => {
    try {
        const { title, link, categories } = req.body;

        if (!categories)
            return res
                .status(400)
                .json({ error: 'Se necesita al menos una categoria' });

        const video = await Video.create({
            title,
            link,
            thumbnail: req.file ? req.file.filename : null,
        });

        const categoriesArray = categories
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

        const categoryInstances = [];
        for (const name of categoriesArray) {
            const [cat] = await Category.findOrCreate({ where: { name } });
            categoryInstances.push(cat);
        }

        await video.addCategories(categoryInstances);

        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video)
            return res.status(404).json({ error: 'Video no encontrado' });

        const { title, link, categories } = req.body;

        if (title) video.title = title;
        if (link) video.link = link;
        if (req.file) video.thumbnail = req.file.filename;

        await video.save();

        if (categories) {
            const categoriesArray = categories
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c.length > 0);

            const categoryInstances = [];
            for (const name of categoriesArray) {
                const [cat] = await Category.findOrCreate({ where: { name } });
                categoryInstances.push(cat);
            }

            await video.setCategories(categoryInstances);
        }

        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video)
            return res.status(404).json({ error: 'Video no encontrado' });

        await video.setCategories([]);
        await video.destroy();

        res.json({ message: 'Video eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
